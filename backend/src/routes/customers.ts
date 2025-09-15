import { Router } from "express";
import prisma from "../config/db";

const router = Router();

// ✅ Get all customers for a tenant (with order count)
router.get("/", async (req, res) => {
  const { tenantId } = req.query;
  if (!tenantId) return res.status(400).json({ error: "Missing tenantId" });

  try {
    const customers = await prisma.customer.findMany({
      where: { tenantId: String(tenantId) },
      include: {
        orders: { select: { id: true } }, // 👈 include orders to count
      },
    });

    const formatted = customers.map((c) => ({
      customerId: c.shopifyId,
      last4Id: `…${c.shopifyId.slice(-4)}`, // show only last 4 digits
      ordersCount: c.orders.length,
      totalSpent: c.totalSpent,
    }));

    res.json(formatted);
  } catch (err) {
    console.error("❌ Fetch customers error:", err);
    res.status(500).json({ error: "Failed to fetch customers" });
  }
});

// ✅ Top 5 customers (by order count or revenue)
router.get("/stats", async (req, res) => {
  const { tenantId } = req.query;
  if (!tenantId) return res.status(400).json({ error: "Missing tenantId" });

  try {
    const topCustomers = await prisma.customer.findMany({
      where: { tenantId: String(tenantId) },
      include: {
        orders: { select: { id: true } },
      },
      orderBy: { totalSpent: "desc" }, // sort by revenue
      take: 5,
    });

    const formatted = topCustomers.map((c) => ({
      customerId: c.shopifyId,
      last4Id: `…${c.shopifyId.slice(-4)}`,
      ordersCount: c.orders.length,
      totalSpent: c.totalSpent,
    }));

    res.json(formatted);
  } catch (err) {
    console.error("❌ Customer stats error:", err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

export default router;
