import { Router, type IRouter } from "express";
import { eq, or, and, isNull, gt } from "drizzle-orm";
import {
  AuthRegisterBody,
  AuthLoginBody,
  AuthRefreshBody,
  AuthLogoutBody,
  AuthLoginResponse,
  AuthRefreshResponse,
  AuthMeResponse,
} from "@workspace/api-zod";
import { db, members, wallets, sessions } from "@workspace/db";
import {
  signAccessToken,
  generateRefreshToken,
  hashRefreshToken,
} from "../lib/jwt";
import { hashPassword, verifyPassword } from "../lib/password";
import { allocateMembershipId, memberToDto } from "../lib/agrillion";
import { requireAuth } from "../middlewares/auth";

const router: IRouter = Router();

router.post("/auth/register", async (req, res) => {
  const parsed = AuthRegisterBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid registration payload", issues: parsed.error.issues });
    return;
  }
  const body = parsed.data;

  const existing = await db
    .select({ id: members.id })
    .from(members)
    .where(or(eq(members.email, body.email.toLowerCase()), eq(members.phone, body.phone)))
    .limit(1);
  if (existing.length > 0) {
    res.status(409).json({ error: "Email or phone already registered" });
    return;
  }

  const membershipId = await allocateMembershipId({
    state: body.state,
    lga: body.lga,
    tier: body.tier ?? "member",
  });
  const passwordHash = await hashPassword(body.password);

  const inserted = await db
    .insert(members)
    .values({
      membershipId,
      fullName: body.fullName,
      email: body.email.toLowerCase(),
      phone: body.phone,
      state: body.state,
      lga: body.lga,
      tier: body.tier ?? "member",
      passwordHash,
    })
    .returning();
  const member = inserted[0]!;

  await db.insert(wallets).values({ memberId: member.id });

  const tokens = await issueTokens(member.id, member.membershipId, member.tier, req.headers["user-agent"] ?? null);

  res.status(201).json(
    AuthLoginResponse.parse({
      ...tokens,
      member: memberToDto(member),
    }),
  );
});

router.post("/auth/login", async (req, res) => {
  const parsed = AuthLoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid login payload" });
    return;
  }
  const { identifier, password } = parsed.data;
  const ident = identifier.trim();

  const rows = await db
    .select()
    .from(members)
    .where(
      or(
        eq(members.membershipId, ident.toUpperCase()),
        eq(members.email, ident.toLowerCase()),
        eq(members.phone, ident),
      ),
    )
    .limit(1);

  const member = rows[0];
  if (!member) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }
  const ok = await verifyPassword(password, member.passwordHash);
  if (!ok) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const tokens = await issueTokens(member.id, member.membershipId, member.tier, req.headers["user-agent"] ?? null);

  res.json(
    AuthLoginResponse.parse({
      ...tokens,
      member: memberToDto(member),
    }),
  );
});

router.post("/auth/refresh", async (req, res) => {
  const parsed = AuthRefreshBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid refresh payload" });
    return;
  }
  const tokenHash = hashRefreshToken(parsed.data.refreshToken);

  const rows = await db
    .select({ session: sessions, member: members })
    .from(sessions)
    .innerJoin(members, eq(sessions.memberId, members.id))
    .where(
      and(
        eq(sessions.refreshTokenHash, tokenHash),
        isNull(sessions.revokedAt),
        gt(sessions.expiresAt, new Date()),
      ),
    )
    .limit(1);

  const found = rows[0];
  if (!found) {
    res.status(401).json({ error: "Invalid or expired refresh token" });
    return;
  }

  // Rotate: revoke old, issue new.
  await db
    .update(sessions)
    .set({ revokedAt: new Date() })
    .where(eq(sessions.id, found.session.id));

  const tokens = await issueTokens(
    found.member.id,
    found.member.membershipId,
    found.member.tier,
    req.headers["user-agent"] ?? null,
  );

  res.json(
    AuthRefreshResponse.parse({
      ...tokens,
      member: memberToDto(found.member),
    }),
  );
});

router.post("/auth/logout", async (req, res) => {
  const parsed = AuthLogoutBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(204).end();
    return;
  }
  const tokenHash = hashRefreshToken(parsed.data.refreshToken);
  await db
    .update(sessions)
    .set({ revokedAt: new Date() })
    .where(eq(sessions.refreshTokenHash, tokenHash));
  res.status(204).end();
});

router.get("/auth/me", requireAuth, async (req, res) => {
  const rows = await db
    .select()
    .from(members)
    .where(eq(members.id, req.auth!.memberId))
    .limit(1);
  const member = rows[0];
  if (!member) {
    res.status(401).json({ error: "Member not found" });
    return;
  }
  res.json(AuthMeResponse.parse(memberToDto(member)));
});

async function issueTokens(
  memberId: string,
  membershipId: string,
  tier: string,
  userAgent: string | null,
) {
  const access = signAccessToken({ sub: memberId, membershipId, tier });
  const refresh = generateRefreshToken();
  await db.insert(sessions).values({
    memberId,
    refreshTokenHash: refresh.hash,
    userAgent: userAgent ?? null,
    expiresAt: refresh.expiresAt,
  });
  return {
    accessToken: access.token,
    accessTokenExpiresAt: access.expiresAt.toISOString(),
    refreshToken: refresh.raw,
  };
}

export default router;
