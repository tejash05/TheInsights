import Shopify from "shopify-api-node";

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

  // Define webhooks as plain strings (shopify-api-node accepts this)
  const webhooks: { topic: string; path: string }[] = [
    { topic: "orders/create", path: `/webhooks/orders/create?tenantId=${tenantId}` },
    { topic: "customers/create", path: `/webhooks/customers/create?tenantId=${tenantId}` },
    { topic: "customers/update", path: `/webhooks/customers/update?tenantId=${tenantId}` },
    { topic: "products/create", path: `/webhooks/products/create?tenantId=${tenantId}` },
    { topic: "products/update", path: `/webhooks/products/update?tenantId=${tenantId}` },
    { topic: "products/delete", path: `/webhooks/products/delete?tenantId=${tenantId}` },
    { topic: "checkouts/update", path: `/webhooks/checkouts/update?tenantId=${tenantId}` },
  ];

  try {
    const existingHooks = await shopify.webhook.list();

    for (const w of webhooks) {
      const address = `${baseUrl}${w.path}`;
      const existing = existingHooks.find(
        (hook: any) => hook.topic === w.topic && hook.address === address
      );

      if (existing) {
        console.log(`ℹ️ Webhook ${w.topic} already exists for tenant ${tenantId}`);
        continue; // skip creating duplicate
      }

      // If same topic exists but pointing to a different address → delete old
      const conflict = existingHooks.find((hook: any) => hook.topic === w.topic);
      if (conflict) {
        await shopify.webhook.delete(conflict.id);
        console.log(`🗑 Deleted old webhook for ${w.topic} (id=${conflict.id})`);
      }

      // Create fresh webhook
      await shopify.webhook.create({
        topic: w.topic as any, // force type for TS
        address,
        format: "json",
      });
      console.log(`✅ Registered webhook ${w.topic} for tenant ${tenantId}`);
    }
  } catch (err: any) {
    console.error("❌ Error registering webhooks:", err.message);
  }
}
