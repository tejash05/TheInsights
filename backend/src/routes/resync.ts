import { Router } from "express";
import prisma from "../config/db";
import { ingestShopifyData } from "../services/shopifyIngest";

const router = Router();

router.post("/", async (req, res) => {
  const { tenantId } = req.query;
  if (!tenantId) return res.status(400).json({ error: "Missing tenantId" });

  const tenant = await prisma.tenant.findUnique({ where: { id: String(tenantId) } });
  if (!tenant) return res.status(404).json({ error: "Tenant not found" });

  try {
    await ingestShopifyData(tenant.id, tenant.shopifyShop, tenant.accessToken);
    res.json({ success: true, message: "Shopify data synced!" });
  } catch (err) {
    console.error("Sync error:", err);
    res.status(500).json({ success: false, error: "Failed to sync Shopify data" });
  }
});

export default router;
