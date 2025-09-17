import { Router } from "express";
import prisma from "../config/db";

const router = Router();

router.get("/ping", async (req, res) => {
  try {
    const tenants = await prisma.tenant.findMany();
    res.json({ ok: true, tenants });
  } catch (err: any) {
    console.error(" DB Test error:", err);
    res.status(500).json({ ok: false, error: err.message || String(err) });
  }
});

export default router;
