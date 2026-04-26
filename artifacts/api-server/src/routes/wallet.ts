import { Router, type IRouter } from "express";
import { GetWalletResponse } from "@workspace/api-zod";
import { getCurrentMember, getOrCreateWallet } from "../lib/agrillion";

const router: IRouter = Router();

router.get("/wallet", async (req, res) => {
  const m = await getCurrentMember(req.auth?.memberId);
  const w = await getOrCreateWallet(m.id);
  res.json(
    GetWalletResponse.parse({
      cashBalance: Number(w.cashBalance),
      smartUnits: Number(w.smartUnits),
      pendingUnits: Number(w.pendingUnits),
      currency: w.currency,
    }),
  );
});

export default router;
