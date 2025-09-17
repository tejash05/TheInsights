import { Router } from "express";
import prisma from "../config/db";

const router = Router();

// ---------------- Top Products List ----------------
router.get("/", async (req, res) => {
  const { tenantId } = req.query;
  if (!tenantId) return res.status(400).json({ error: "Missing tenantId" });

  try {
    const products = await prisma.product.findMany({
      where: { tenantId: String(tenantId) },
      orderBy: { price: "desc" },
      take: 10,
    });

    res.json(products);
  } catch (err: any) {
    console.error(" Fetch products error:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// ---------------- Revenue Contribution per Product ----------------
router.get("/stats", async (req, res) => {
  const { tenantId } = req.query;
  if (!tenantId) return res.status(400).json({ error: "Missing tenantId" });

  try {
    // Step 1: Get all orders for this tenant
    const tenantOrders = await prisma.order.findMany({
      where: { tenantId: String(tenantId) },
      select: { id: true },
    });

    const orderIds = tenantOrders.map((o) => o.id);

    // Step 2: If no orders, fallback to product catalog
    if (orderIds.length === 0) {
      const fallbackProducts = await prisma.product.findMany({
        where: { tenantId: String(tenantId) },
        orderBy: { price: "desc" },
        take: 5,
      });

      return res.json(
        fallbackProducts.map((p) => ({
          productId: p.id,
          name: p.title,
          units: 0,
          revenue: 0,
        }))
      );
    }

    // Step 3: Aggregate order items for those orders
    const grouped = await prisma.orderItem.groupBy({
      by: ["productId"],
      _sum: {
        quantity: true,
        price: true, // already stores line total in ingestion
      },
      where: {
        orderId: { in: orderIds }, //  only tenant's orders
      },
    });

    // Step 4: Join with Product titles
    const results = await Promise.all(
      grouped.map(async (g) => {
        const product = await prisma.product.findUnique({
          where: { id: g.productId },
        });

        return {
          productId: g.productId,
          name: product?.title || "Unknown",
          units: g._sum.quantity || 0,
          revenue: g._sum.price || 0,
        };
      })
    );

    // Step 5: Sort by revenue desc & take top 5
    const topProducts = results.sort((a, b) => b.revenue - a.revenue).slice(0, 5);

    res.json(topProducts);
  } catch (err: any) {
    console.error("Product stats error:", err);
    res.status(500).json({ error: "Failed to fetch product stats" });
  }
});

export default router;
