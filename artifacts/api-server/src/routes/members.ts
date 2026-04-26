import { Router, type IRouter } from "express";
import { GetMyMemberResponse } from "@workspace/api-zod";
import { getCurrentMember } from "../lib/agrillion";

const router: IRouter = Router();

router.get("/members/me", async (req, res) => {
  const m = await getCurrentMember(req.auth?.memberId);
  const data = GetMyMemberResponse.parse({
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
  });
  res.json(data);
});

export default router;
