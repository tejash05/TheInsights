import { Request, Response, NextFunction } from "express";

/**
 * Simple middleware that checks if tenantId is present.
 * In production, extend this for JWT or API key authentication.
 */
export function requireTenant(req: Request, res: Response, next: NextFunction) {
  const { tenantId } = req.query;
  if (!tenantId) {
    return res.status(401).json({ error: "Missing tenantId" });
  }
  next();
}
