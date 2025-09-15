import Shopify, { WebhookTopic } from "shopify-api-node";

/**
 * Register Shopify webhooks for a given tenant
 */
export async function registerWebhooks(
  tenantId: string,
  shop: string,
  accessToken: string
) {
  // shopify-api-node expects shopName WITHOUT ".myshopify.com"
  const shopify = new Shopify({
    shopName: shop.replace(".myshopify.com", ""),
    accessToken,
  });

  const baseUrl = process.env.BACKEND_URL;
  if (!baseUrl) {
    throw new Error("❌ Missing BACKEND_URL in environment variables");
  }

  const webhooks: { topic: WebhookTopic; path: string }[] = [
    { topic: "orders/create" as WebhookTopic, path: `/webhooks/orders/create?tenantId=${tenantId}` },
    { topic: "customers/create" as WebhookTopic, path: `/webhooks/customers/create?tenantId=${tenantId}` },
    { topic: "customers/update" as WebhookTopic, path: `/webhooks/customers/update?tenantId=${tenantId}` },
    { topic: "products/create" as WebhookTopic, path: `/webhooks/products/create?tenantId=${tenantId}` },
    { topic: "products/update" as WebhookTopic, path: `/webhooks/products/update?tenantId=${tenantId}` },
    { topic: "products/delete" as WebhookTopic, path: `/webhooks/products/delete?tenantId=${tenantId}` },
    { topic: "checkouts/update" as WebhookTopic, path: `/webhooks/checkouts/update?tenantId=${tenantId}` },
  ];

  for (const w of webhooks) {
    try {
      await shopify.webhook.create({
        topic: w.topic,
        address: `${baseUrl}${w.path}`,
        format: "json",
      });
      console.log(`✅ Registered webhook ${w.topic} for tenant ${tenantId}`);
    } catch (err: any) {
      console.error(`❌ Failed to register webhook ${w.topic}:`, err.message);
    }
  }
}
