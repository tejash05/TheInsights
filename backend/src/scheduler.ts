import cron from "node-cron";
import { ingestShopifyData } from "./services/shopifyIngest";
import prisma from "./config/db";

// Run every 6 hours (cron format: minute hour day month weekday)
cron.schedule("0 */6 * * *", async () => {
  console.log("⏰ Scheduled job: Shopify data resync started");

  try {
    const tenants = await prisma.tenant.findMany();

    for (const tenant of tenants) {
      try {
        await ingestShopifyData(
          tenant.id,
          tenant.shopifyShop,
          tenant.accessToken
        );
        console.log(`✅ Resynced tenant: ${tenant.name}`);
      } catch (err: any) {
        console.error(`❌ Failed resync for tenant ${tenant.name}:`, err.message);
      }
    }
  } catch (err: any) {
    console.error("❌ Scheduler failed:", err.message);
  }
});
