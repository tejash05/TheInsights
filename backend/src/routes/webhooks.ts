import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

/**
 * Shopify webhook: Order Created
 */
router.post("/orders/create", async (req, res) => {
  const order = req.body;
  const tenantId = req.query.tenantId as string;

  if (!tenantId) {
    return res.status(400).json({ error: "Missing tenantId in webhook URL" });
  }

  try {
    await prisma.order.upsert({
      where: { shopifyId: String(order.id) },
      update: {
        total: parseFloat(order.total_price || "0"),
        tenantId,
      },
      create: {
        shopifyId: String(order.id),
        total: parseFloat(order.total_price || "0"),
        tenantId,
      },
    });

    console.log(`✅ Webhook order synced for tenant ${tenantId}`);
    res.status(200).send("OK");
  } catch (err: any) {
    console.error("❌ Webhook order error:", err);
    res.status(500).json({ error: err.message || "Failed to sync order" });
  }
});

/**
 * Shopify webhook: Checkout Update (abandoned / started)
 */
router.post("/checkouts/update", async (req, res) => {
  const checkout = req.body;
  const tenantId = req.query.tenantId as string;

  if (!tenantId) {
    return res.status(400).json({ error: "Missing tenantId in webhook URL" });
  }

  try {
    await prisma.event.create({
      data: {
        tenantId,
        type: checkout.abandoned_checkout_url ? "cart_abandoned" : "checkout_started",
        payload: checkout,
      },
    });

    console.log(`✅ Webhook checkout event for tenant ${tenantId}`);
    res.status(200).send("OK");
  } catch (err: any) {
    console.error("❌ Webhook checkout error:", err);
    res.status(500).json({ error: err.message || "Failed to handle checkout event" });
  }
});

export default router;
