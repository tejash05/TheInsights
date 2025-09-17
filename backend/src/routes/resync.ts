import { Router } from "express";
import prisma from "../config/db";
import { ingestShopifyData } from "../services/shopifyIngest";

const router = Router();

// POST /resync/:tenantId
router.post("/:tenantId", async (req, res) => {
  const { tenantId } = req.params;
  if (!tenantId) return res.status(400).json({ error: "Missing tenantId" });

  const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
  if (!tenant) return res.status(404).json({ error: "Tenant not found" });

  try {
    const counts = await ingestShopifyData(
      tenant.id,
      tenant.shopifyShop,
      tenant.accessToken
    );

    // ✅ Return counts so frontend can show "x customers, y products, z orders"
    res.json({ success: true, counts });
  } catch (err) {
    console.error("Sync error:", err);
    res.status(500).json({ success: false, error: "Failed to sync Shopify data" });
  }
});

export default router;
