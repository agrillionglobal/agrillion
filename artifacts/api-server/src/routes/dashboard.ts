import { Router, type IRouter } from "express";
import {
  GetDashboardSummaryResponse,
  GetRecentActivityQueryParams,
  GetRecentActivityResponse,
  ListNotificationsResponse,
} from "@workspace/api-zod";
import {
  db,
  smartUnitsLedger,
  utilityTransactions,
  martOrders,
  notifications,
  getCurrentMember,
  getOrCreateWallet,
  desc,
  eq,
  sql,
} from "../lib/agrillion";

const router: IRouter = Router();

router.get("/dashboard/summary", async (_req, res) => {
  const m = await getCurrentMember();
  const w = await getOrCreateWallet(m.id);

  const monthStart = new Date();
  monthStart.setUTCDate(1);
  monthStart.setUTCHours(0, 0, 0, 0);

  const purchasesThisMonth = await db
    .select({ c: sql<string>`COUNT(*)` })
    .from(utilityTransactions)
    .where(
      sql`${utilityTransactions.memberId} = ${m.id} AND ${utilityTransactions.createdAt} >= ${monthStart}`,
    );

  const earnedRow = await db
    .select({ s: sql<string>`COALESCE(SUM(${smartUnitsLedger.unitsAdded}), 0)` })
    .from(smartUnitsLedger)
    .where(
      sql`${smartUnitsLedger.memberId} = ${m.id} AND ${smartUnitsLedger.createdAt} >= ${monthStart}`,
    );

  const martCountRow = await db
    .select({ c: sql<string>`COUNT(*)` })
    .from(martOrders)
    .where(eq(martOrders.memberId, m.id));

  const unreadRow = await db
    .select({ c: sql<string>`COUNT(*)` })
    .from(notifications)
    .where(sql`${notifications.memberId} = ${m.id} AND ${notifications.read} = false`);

  const spendByCategoryRows = await db
    .select({
      category: utilityTransactions.serviceCategory,
      amount: sql<string>`COALESCE(SUM(${utilityTransactions.amount}), 0)`,
    })
    .from(utilityTransactions)
    .where(eq(utilityTransactions.memberId, m.id))
    .groupBy(utilityTransactions.serviceCategory);

  // Weekly units (last 7 days)
  const weekly: { day: string; units: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - i);
    d.setUTCHours(0, 0, 0, 0);
    const next = new Date(d);
    next.setUTCDate(d.getUTCDate() + 1);
    const r = await db
      .select({ s: sql<string>`COALESCE(SUM(${smartUnitsLedger.unitsAdded}), 0)` })
      .from(smartUnitsLedger)
      .where(
        sql`${smartUnitsLedger.memberId} = ${m.id} AND ${smartUnitsLedger.createdAt} >= ${d} AND ${smartUnitsLedger.createdAt} < ${next}`,
      );
    weekly.push({
      day: d.toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" }),
      units: Number(r[0]?.s ?? 0),
    });
  }

  res.json(
    GetDashboardSummaryResponse.parse({
      member: {
        id: m.id,
        membershipId: m.membershipId,
        fullName: m.fullName,
        email: m.email,
        phone: m.phone,
        state: m.state,
        lga: m.lga,
        tier: m.tier,
        joinedAt: m.joinedAt.toISOString(),
        avatarUrl: m.avatarUrl,
      },
      wallet: {
        cashBalance: Number(w.cashBalance),
        smartUnits: Number(w.smartUnits),
        pendingUnits: Number(w.pendingUnits),
        currency: w.currency,
      },
      utilityPurchasesThisMonth: Number(purchasesThisMonth[0]?.c ?? 0),
      unitsEarnedThisMonth: Number(earnedRow[0]?.s ?? 0),
      martOrdersCount: Number(martCountRow[0]?.c ?? 0),
      unreadNotifications: Number(unreadRow[0]?.c ?? 0),
      spendByCategory: spendByCategoryRows.map((r) => ({
        category: r.category,
        amount: Number(r.amount),
      })),
      weeklyUnits: weekly,
    }),
  );
});

router.get("/dashboard/activity", async (req, res) => {
  const params = GetRecentActivityQueryParams.parse({
    limit: req.query.limit ? Number(req.query.limit) : undefined,
  });
  const m = await getCurrentMember();
  const limit = params.limit ?? 20;

  const utilities = await db
    .select()
    .from(utilityTransactions)
    .where(eq(utilityTransactions.memberId, m.id))
    .orderBy(desc(utilityTransactions.createdAt))
    .limit(limit);

  const orders = await db
    .select()
    .from(martOrders)
    .where(eq(martOrders.memberId, m.id))
    .orderBy(desc(martOrders.createdAt))
    .limit(limit);

  const transfers = await db
    .select()
    .from(smartUnitsLedger)
    .where(
      sql`${smartUnitsLedger.memberId} = ${m.id} AND (${smartUnitsLedger.sourceType} = 'transfer_in' OR ${smartUnitsLedger.sourceType} = 'transfer_out')`,
    )
    .orderBy(desc(smartUnitsLedger.createdAt))
    .limit(limit);

  type Item = {
    id: string;
    kind: "utility" | "mart" | "transfer" | "project" | "bonus" | "system";
    title: string;
    description: string;
    amount?: number | null;
    units?: number | null;
    createdAt: string;
  };

  const items: Item[] = [];
  utilities.forEach((u: typeof utilityTransactions.$inferSelect) =>
    items.push({
      id: `utl-${u.id}`,
      kind: "utility",
      title: `${u.provider} ${u.serviceCategory}`,
      description: `Paid for ${u.beneficiary}`,
      amount: Number(u.amount),
      units: Number(u.unitsEarned),
      createdAt: u.createdAt.toISOString(),
    }),
  );
  orders.forEach((o: typeof martOrders.$inferSelect) =>
    items.push({
      id: `mart-${o.id}`,
      kind: "mart",
      title: o.productName,
      description: `Mart order — ${o.paymentMethod} payment`,
      amount: Number(o.totalNgn),
      units: Number(o.unitsUsed),
      createdAt: o.createdAt.toISOString(),
    }),
  );
  transfers.forEach((t: typeof smartUnitsLedger.$inferSelect) =>
    items.push({
      id: `trf-${t.id}`,
      kind: "transfer",
      title: t.sourceType === "transfer_in" ? "Smart Units received" : "Smart Units sent",
      description: t.description,
      units: t.sourceType === "transfer_in" ? Number(t.unitsAdded) : Number(t.unitsUsed),
      createdAt: t.createdAt.toISOString(),
    }),
  );

  items.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));
  res.json(GetRecentActivityResponse.parse(items.slice(0, limit)));
});

router.get("/dashboard/notifications", async (_req, res) => {
  const m = await getCurrentMember();
  const rows = await db
    .select()
    .from(notifications)
    .where(eq(notifications.memberId, m.id))
    .orderBy(desc(notifications.createdAt));
  res.json(
    ListNotificationsResponse.parse(
      rows.map((n: typeof notifications.$inferSelect) => ({
        id: n.id,
        title: n.title,
        body: n.body,
        kind: n.kind,
        read: n.read,
        createdAt: n.createdAt.toISOString(),
      })),
    ),
  );
});

export default router;
