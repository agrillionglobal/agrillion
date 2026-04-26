import { Router, type IRouter } from "express";
import {
  ListUtilityServicesResponse,
  ListUtilityTransactionsQueryParams,
  ListUtilityTransactionsResponse,
  CreateUtilityTransactionBody,
} from "@workspace/api-zod";
import {
  db,
  wallets,
  utilityTransactions,
  smartUnitsLedger,
  adminSettings,
  getCurrentMember,
  getOrCreateWallet,
  marginForCategory,
  genReference,
  UTILITY_SERVICES,
  desc,
  eq,
} from "../lib/agrillion";

const router: IRouter = Router();

router.get("/utilities/services", async (_req, res) => {
  res.json(ListUtilityServicesResponse.parse(UTILITY_SERVICES));
});

router.get("/utilities/transactions", async (req, res) => {
  const params = ListUtilityTransactionsQueryParams.parse({
    limit: req.query.limit ? Number(req.query.limit) : undefined,
  });
  const m = await getCurrentMember(req.auth?.memberId);
  const limit = params.limit ?? 50;
  const rows = await db
    .select()
    .from(utilityTransactions)
    .where(eq(utilityTransactions.memberId, m.id))
    .orderBy(desc(utilityTransactions.createdAt))
    .limit(limit);

  res.json(
    ListUtilityTransactionsResponse.parse(
      rows.map((r: typeof utilityTransactions.$inferSelect) => ({
        id: r.id,
        memberId: r.memberId,
        memberName: m.fullName,
        membershipId: m.membershipId,
        serviceCategory: r.serviceCategory,
        provider: r.provider,
        beneficiary: r.beneficiary,
        amount: Number(r.amount),
        marginGenerated: Number(r.marginGenerated),
        unitsEarned: Number(r.unitsEarned),
        status: r.status,
        reference: r.reference,
        createdAt: r.createdAt.toISOString(),
      })),
    ),
  );
});

router.post("/utilities/transactions", async (req, res) => {
  const body = CreateUtilityTransactionBody.parse(req.body);
  const m = await getCurrentMember(req.auth?.memberId);
  const w = await getOrCreateWallet(m.id);

  const settingsRow = await db.select().from(adminSettings).limit(1);
  const split = settingsRow[0]?.rewardSplitMemberPct ?? 60;

  const margin = +(body.amount * marginForCategory(body.serviceCategory)).toFixed(2);
  const units = +((margin * split) / 100).toFixed(2);
  const reference = genReference("UTL");

  const [tx] = await db
    .insert(utilityTransactions)
    .values({
      memberId: m.id,
      serviceCategory: body.serviceCategory,
      provider: body.provider,
      beneficiary: body.beneficiary,
      amount: body.amount.toFixed(2),
      marginGenerated: margin.toFixed(2),
      unitsEarned: units.toFixed(2),
      status: "success",
      reference,
    })
    .returning();

  const newBal = Number(w.smartUnits) + units;
  await db
    .update(wallets)
    .set({ smartUnits: newBal.toFixed(2), updatedAt: new Date() })
    .where(eq(wallets.memberId, m.id));

  await db.insert(smartUnitsLedger).values({
    memberId: m.id,
    sourceType: "utility",
    referenceId: reference,
    unitsAdded: units.toFixed(2),
    unitsUsed: "0",
    balanceAfter: newBal.toFixed(2),
    description: `Earned from ${body.provider} ${body.serviceCategory} payment`,
  });

  res.status(201).json({
    transaction: {
      id: tx!.id,
      memberId: tx!.memberId,
      memberName: m.fullName,
      membershipId: m.membershipId,
      serviceCategory: tx!.serviceCategory,
      provider: tx!.provider,
      beneficiary: tx!.beneficiary,
      amount: Number(tx!.amount),
      marginGenerated: Number(tx!.marginGenerated),
      unitsEarned: Number(tx!.unitsEarned),
      status: tx!.status,
      reference: tx!.reference,
      createdAt: tx!.createdAt.toISOString(),
    },
    unitsEarned: units,
    newUnitBalance: newBal,
  });
});

export default router;
