import { Router } from "express";
import prisma from "../config/db";

const router = Router();

// Recent orders
router.get("/", async (req, res) => {
  const { tenantId } = req.query;
  if (!tenantId) return res.status(400).json({ error: "Missing tenantId" });

  const orders = await prisma.order.findMany({
    where: { tenantId: String(tenantId) },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  res.json(orders);
});

// Orders by date (for charts)
router.get("/stats", async (req, res) => {
  const { tenantId } = req.query;
  if (!tenantId) return res.status(400).json({ error: "Missing tenantId" });

  const grouped = await prisma.order.groupBy({
    by: ["createdAt"],
    where: { tenantId: String(tenantId) },
    _sum: { total: true },
  });

  res.json(grouped.map(g => ({
    date: g.createdAt,
    total: g._sum.total
  })));
});

export default router;
