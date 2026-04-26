import jwt, { type SignOptions } from "jsonwebtoken";
import crypto from "node:crypto";

const ACCESS_SECRET: string =
  process.env.JWT_ACCESS_SECRET ?? "agrillion-dev-access-secret-change-me";
const REFRESH_PEPPER: string =
  process.env.JWT_REFRESH_PEPPER ?? "agrillion-dev-refresh-pepper-change-me";

const ACCESS_TTL_SECONDS = 60 * 15;
const REFRESH_TTL_DAYS = 30;

export type AccessTokenPayload = {
  sub: string;
  membershipId: string;
  tier: string;
};

export function signAccessToken(payload: AccessTokenPayload): {
  token: string;
  expiresAt: Date;
} {
  const opts: SignOptions = { expiresIn: ACCESS_TTL_SECONDS };
  const token = jwt.sign(payload, ACCESS_SECRET, opts);
  const expiresAt = new Date(Date.now() + ACCESS_TTL_SECONDS * 1000);
  return { token, expiresAt };
}

export function verifyAccessToken(token: string): AccessTokenPayload | null {
  try {
    const decoded = jwt.verify(token, ACCESS_SECRET);
    if (
      decoded &&
      typeof decoded === "object" &&
      typeof (decoded as Record<string, unknown>).sub === "string" &&
      typeof (decoded as Record<string, unknown>).membershipId === "string" &&
      typeof (decoded as Record<string, unknown>).tier === "string"
    ) {
      return decoded as AccessTokenPayload;
    }
    return null;
  } catch {
    return null;
  }
}

export function generateRefreshToken(): { raw: string; hash: string; expiresAt: Date } {
  const raw = crypto.randomBytes(48).toString("base64url");
  const hash = hashRefreshToken(raw);
  const expiresAt = new Date(Date.now() + REFRESH_TTL_DAYS * 24 * 60 * 60 * 1000);
  return { raw, hash, expiresAt };
}

export function hashRefreshToken(raw: string): string {
  return crypto
    .createHmac("sha256", REFRESH_PEPPER)
    .update(raw)
    .digest("hex");
}
