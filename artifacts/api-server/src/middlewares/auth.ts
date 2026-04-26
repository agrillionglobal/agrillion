import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../lib/jwt";

export type AuthContext = {
  memberId: string;
  membershipId: string;
  tier: string;
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      auth?: AuthContext;
    }
  }
}

/**
 * Optional auth: if a valid Bearer token is present, attach req.auth.
 * Never rejects — downstream code falls back to the demo member when missing.
 */
export function attachAuth(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (header?.startsWith("Bearer ")) {
    const token = header.slice("Bearer ".length).trim();
    const payload = verifyAccessToken(token);
    if (payload) {
      req.auth = {
        memberId: payload.sub,
        membershipId: payload.membershipId,
        tier: payload.tier,
      };
    }
  }
  next();
}

/** Strict auth: 401 when no valid token. */
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  if (!req.auth) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }
  next();
}
