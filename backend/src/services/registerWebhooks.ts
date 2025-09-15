import { getShopifyClient } from "../config/shopify";
import { WebhookTopic } from "shopify-api-node";

/**
 * Registers Shopify webhooks for a given tenant.
 * Each webhook includes tenantId in query so we can map incoming events.
 */
export async function registerWebhooks(
  shopifyShop: string,
  accessToken: string,
  tenantId: string
) {
  const shopify = getShopifyClient(shopifyShop, accessToken);

  const topics: { topic: WebhookTopic; endpoint: string }[] = [
    { topic: "orders/create", endpoint: `/webhooks/orders/create?tenantId=${tenantId}` },
    { topic: "customers/create", endpoint: `/webhooks/customers/create?tenantId=${tenantId}` },
    { topic: "products/update", endpoint: `/webhooks/products/update?tenantId=${tenantId}` },
    { topic: "checkouts/update", endpoint: `/webhooks/checkouts/update?tenantId=${tenantId}` },
  ];

  for (const { topic, endpoint } of topics) {
    try {
      await shopify.webhook.create({
        topic,
        address: `${process.env.BASE_URL}${endpoint}`, // 👈 BASE_URL = your public backend URL
        format: "json",
      });
      console.log(`✅ Webhook ${topic} registered for tenant ${tenantId}`);
    } catch (err: any) {
      if (err.message?.includes("already exists")) {
        console.log(`ℹ️ Webhook ${topic} already exists for tenant ${tenantId}`);
      } else {
        console.error(`❌ Failed to register webhook ${topic}:`, err.message);
      }
    }
  }
}
