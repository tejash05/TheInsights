import { Router } from "express";
import prisma from "../config/db";

const router = Router();

/**
 * ---------------- Recent Orders ----------------
 */
router.get("/", async (req, res) => {
  const { tenantId } = req.query;
  if (!tenantId) return res.status(400).json({ error: "Missing tenantId" });

  try {
    const orders = await prisma.order.findMany({
      where: { tenantId: String(tenantId) },
      include: { customer: true }, // ✅ join with customer
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    // ✅ Send consistent shape (id, total, createdAt, customerId)
    const formatted = orders.map((o) => ({
      id: o.shopifyId,
      total: o.total,
      createdAt: o.createdAt,
      customerId: o.customer?.shopifyId || "Unknown", // 👈 just return ID
    }));

    res.json(formatted);
  } catch (err: any) {
    console.error("❌ Fetch orders error:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

/**
 * ---------------- Orders by Date (for charts) ----------------
 */
router.get("/stats", async (req, res) => {
  const { tenantId } = req.query;
  if (!tenantId) return res.status(400).json({ error: "Missing tenantId" });

  try {
    const orders = await prisma.order.findMany({
      where: { tenantId: String(tenantId) },
      orderBy: { createdAt: "asc" },
      select: { createdAt: true, id: true },
    });

    // ✅ Group by date (count orders per day)
    const grouped: Record<string, number> = {};
    orders.forEach((o) => {
      const date = o.createdAt.toISOString().split("T")[0]; // YYYY-MM-DD
      grouped[date] = (grouped[date] || 0) + 1;
    });

    const stats = Object.entries(grouped).map(([date, orders]) => ({
      date,
      orders,
    }));

    res.json(stats);
  } catch (err: any) {
    console.error("❌ Orders stats error:", err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

export default router;
