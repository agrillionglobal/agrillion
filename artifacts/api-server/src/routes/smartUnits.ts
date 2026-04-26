import { Router, type IRouter } from "express";
import {
  GetSmartUnitsSummaryResponse,
  ListSmartUnitsLedgerQueryParams,
  ListSmartUnitsLedgerResponse,
  TransferSmartUnitsBody,
  TransferSmartUnitsResponse,
} from "@workspace/api-zod";
import {
  db,
  members,
  wallets,
  smartUnitsLedger,
  utilityTransactions,
  getCurrentMember,
  getOrCreateWallet,
  genReference,
  desc,
  eq,
  sql,
} from "../lib/agrillion";

const router: IRouter = Router();

router.get("/smart-units/summary", async (req, res) => {
  const m = await getCurrentMember(req.auth?.memberId);
  const w = await getOrCreateWallet(m.id);

  const monthStart = new Date();
  monthStart.setUTCDate(1);
  monthStart.setUTCHours(0, 0, 0, 0);

  const earnedRow = await db
    .select({ s: sql<string>`COALESCE(SUM(${smartUnitsLedger.unitsAdded}), 0)` })
    .from(smartUnitsLedger)
    .where(
      sql`${smartUnitsLedger.memberId} = ${m.id} AND ${smartUnitsLedger.createdAt} >= ${monthStart}`,
    );

  const usedRow = await db
    .select({ s: sql<string>`COALESCE(SUM(${smartUnitsLedger.unitsUsed}), 0)` })
    .from(smartUnitsLedger)
    .where(eq(smartUnitsLedger.memberId, m.id));

  // Build last 6 months trend
  const trendRows = await db
    .select({
      month: sql<string>`to_char(${smartUnitsLedger.createdAt}, 'YYYY-MM')`,
      earned: sql<string>`COALESCE(SUM(${smartUnitsLedger.unitsAdded}), 0)`,
      used: sql<string>`COALESCE(SUM(${smartUnitsLedger.unitsUsed}), 0)`,
    })
    .from(smartUnitsLedger)
    .where(eq(smartUnitsLedger.memberId, m.id))
    .groupBy(sql`to_char(${smartUnitsLedger.createdAt}, 'YYYY-MM')`)
    .orderBy(sql`to_char(${smartUnitsLedger.createdAt}, 'YYYY-MM')`);

  type TrendRow = { month: string; earned: string; used: string };
  type TrendPoint = { month: string; earned: number; used: number };
  const trend: TrendPoint[] = (trendRows as TrendRow[]).slice(-6).map((r: TrendRow) => ({
    month: r.month,
    earned: Number(r.earned),
    used: Number(r.used),
  }));

  // pad to exactly 6 months ending with current month
  const monthMap = new Map(trend.map((t) => [t.month, t]));
  const padded: TrendPoint[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setUTCDate(1);
    d.setUTCMonth(d.getUTCMonth() - i);
    const tag = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
    padded.push(monthMap.get(tag) ?? { month: tag, earned: 0, used: 0 });
  }
  trend.length = 0;
  trend.push(...padded);

  res.json(
    GetSmartUnitsSummaryResponse.parse({
      totalUnits: Number(w.smartUnits),
      earnedThisMonth: Number(earnedRow[0]?.s ?? 0),
      usedUnits: Number(usedRow[0]?.s ?? 0),
      pendingUnits: Number(w.pendingUnits),
      unitValueNgn: 1,
      monthlyTrend: trend,
    }),
  );
});

router.get("/smart-units/ledger", async (req, res) => {
  const params = ListSmartUnitsLedgerQueryParams.parse({
    limit: req.query.limit ? Number(req.query.limit) : undefined,
  });
  const m = await getCurrentMember(req.auth?.memberId);
  const limit = params.limit ?? 50;
  const rows = await db
    .select()
    .from(smartUnitsLedger)
    .where(eq(smartUnitsLedger.memberId, m.id))
    .orderBy(desc(smartUnitsLedger.createdAt))
    .limit(limit);

  res.json(
    ListSmartUnitsLedgerResponse.parse(
      rows.map((r: typeof smartUnitsLedger.$inferSelect) => ({
        id: r.id,
        sourceType: r.sourceType,
        referenceId: r.referenceId,
        unitsAdded: Number(r.unitsAdded),
        unitsUsed: Number(r.unitsUsed),
        balanceAfter: Number(r.balanceAfter),
        description: r.description,
        createdAt: r.createdAt.toISOString(),
      })),
    ),
  );
});

router.post("/smart-units/transfer", async (req, res) => {
  const body = TransferSmartUnitsBody.parse(req.body);
  const m = await getCurrentMember(req.auth?.memberId);
  const w = await getOrCreateWallet(m.id);

  if (body.units <= 0) {
    res.status(400).json({ error: "Units must be greater than zero" });
    return;
  }
  if (Number(w.smartUnits) < body.units) {
    res.status(400).json({ error: "Insufficient Smart Units" });
    return;
  }

  const recipient = await db
    .select()
    .from(members)
    .where(eq(members.membershipId, body.toMembershipId))
    .limit(1);
  if (!recipient[0]) {
    res.status(404).json({ error: "Recipient member not found" });
    return;
  }
  if (recipient[0].id === m.id) {
    res.status(400).json({ error: "Cannot transfer to your own account" });
    return;
  }
  // Demo PIN check (default 0000)
  if (body.walletPin && body.walletPin !== "0000") {
    res.status(401).json({ error: "Invalid wallet PIN" });
    return;
  }

  const reference = genReference("TRF");

  const newSenderBal = Number(w.smartUnits) - body.units;
  await db.update(wallets).set({ smartUnits: newSenderBal.toFixed(2), updatedAt: new Date() }).where(eq(wallets.memberId, m.id));

  const recvWallet = await getOrCreateWallet(recipient[0].id);
  const newRecvBal = Number(recvWallet.smartUnits) + body.units;
  await db.update(wallets).set({ smartUnits: newRecvBal.toFixed(2), updatedAt: new Date() }).where(eq(wallets.memberId, recipient[0].id));

  await db.insert(smartUnitsLedger).values([
    {
      memberId: m.id,
      sourceType: "transfer_out",
      referenceId: reference,
      unitsAdded: "0",
      unitsUsed: body.units.toFixed(2),
      balanceAfter: newSenderBal.toFixed(2),
      description: `Transfer to ${recipient[0].membershipId}${body.note ? ` — ${body.note}` : ""}`,
    },
    {
      memberId: recipient[0].id,
      sourceType: "transfer_in",
      referenceId: reference,
      unitsAdded: body.units.toFixed(2),
      unitsUsed: "0",
      balanceAfter: newRecvBal.toFixed(2),
      description: `Received from ${m.membershipId}`,
    },
  ]);

  res.json(
    TransferSmartUnitsResponse.parse({
      success: true,
      newBalance: newSenderBal,
      reference,
    }),
  );
});

// Skip silencing avoidance:
void utilityTransactions;

export default router;
