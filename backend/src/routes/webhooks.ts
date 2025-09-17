import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

/**
 * Helper: Resolve tenant from Shopify header
 */
async function resolveTenant(req: any) {
  const shop = req.get("X-Shopify-Shop-Domain");
  if (!shop) throw new Error("Missing X-Shopify-Shop-Domain header");

  const tenant = await prisma.tenant.findFirst({ where: { shopifyShop: shop } });
  if (!tenant) throw new Error(`No tenant found for shop domain ${shop}`);

  return tenant;
}

/**
 * Formatters for clean event payload
 */
function formatOrder(order: any) {
  return {
    id: String(order.id),
    title: order.name || `#${order.order_number}`,
    email: order.email,
    total: parseFloat(order.total_price || "0"),
    status: order.financial_status,
  };
}

function formatCustomer(customer: any) {
  return {
    id: String(customer.id),
    email: customer.email,
    name:
      `${customer.first_name || ""} ${customer.last_name || ""}`.trim() ||
      "Anonymous",
  };
}

function formatProduct(product: any) {
  return {
    id: String(product.id),
    title: product.title,
    status: product.status,
  };
}

function formatCheckout(checkout: any) {
  return {
    id: String(checkout.id),
    title: checkout.name || `#${checkout.id}`,
    email: checkout.email,
    total: parseFloat(checkout.total_price || "0"),
    status: checkout.abandoned_checkout_url ? "abandoned" : "started",
  };
}

/**
 * ---------------- Orders ----------------
 */
router.post("/orders/create", async (req, res) => {
  try {
    const tenant = await resolveTenant(req);
    const order = req.body;

    // ensure customer exists
    let customerId: string | null = null;
    if (order.customer?.id) {
      const dbCustomer = await prisma.customer.upsert({
        where: { shopifyId: String(order.customer.id) },
        update: {
          name:
            `${order.customer.first_name || ""} ${
              order.customer.last_name || ""
            }`.trim() || "Anonymous",
          email: order.customer.email,
        },
        create: {
          shopifyId: String(order.customer.id),
          name:
            `${order.customer.first_name || ""} ${
              order.customer.last_name || ""
            }`.trim() || "Anonymous",
          email: order.customer.email,
          tenantId: tenant.id,
          totalSpent: 0,
        },
      });
      customerId = dbCustomer.id;
    }

    await prisma.order.upsert({
      where: { shopifyId: String(order.id) },
      update: {
        total: parseFloat(order.total_price || "0"),
        tenantId: tenant.id,
        customerId,
      },
      create: {
        shopifyId: String(order.id),
        total: parseFloat(order.total_price || "0"),
        tenantId: tenant.id,
        customerId,
      },
    });

    await prisma.event.create({
      data: {
        tenantId: tenant.id,
        type: "order_created",
        payload: formatOrder(order),
        customerId,
      },
    });

    console.log(`✅ Webhook: Order created for tenant ${tenant.id}`);
    res.status(200).send("OK");
  } catch (err: any) {
    console.error("❌ Webhook order error:", err.message);
    res.status(500).json({ error: err.message || "Failed to sync order" });
  }
});

/**
 * ---------------- Customers ----------------
 */
router.post("/customers/create", async (req, res) => {
  try {
    const tenant = await resolveTenant(req);
    const customer = req.body;

    const dbCustomer = await prisma.customer.upsert({
      where: { shopifyId: String(customer.id) },
      update: {
        name:
          `${customer.first_name || ""} ${customer.last_name || ""}`.trim() ||
          "Anonymous",
        email: customer.email,
        totalSpent: parseFloat(customer.total_spent || "0"),
      },
      create: {
        shopifyId: String(customer.id),
        name:
          `${customer.first_name || ""} ${customer.last_name || ""}`.trim() ||
          "Anonymous",
        email: customer.email,
        tenantId: tenant.id,
        totalSpent: parseFloat(customer.total_spent || "0"),
      },
    });

    await prisma.event.create({
      data: {
        tenantId: tenant.id,
        type: "customer_created",
        payload: formatCustomer(customer),
        customerId: dbCustomer.id,
      },
    });

    res.status(200).send("OK");
  } catch (err: any) {
    console.error("❌ Webhook customer error:", err.message);
    res.status(500).json({ error: err.message || "Failed to sync customer" });
  }
});

router.post("/customers/update", async (req, res) => {
  try {
    const tenant = await resolveTenant(req);
    const customer = req.body;

    const dbCustomer = await prisma.customer.upsert({
      where: { shopifyId: String(customer.id) },
      update: {
        name:
          `${customer.first_name || ""} ${customer.last_name || ""}`.trim() ||
          "Anonymous",
        email: customer.email,
        totalSpent: parseFloat(customer.total_spent || "0"),
      },
      create: {
        shopifyId: String(customer.id),
        name:
          `${customer.first_name || ""} ${customer.last_name || ""}`.trim() ||
          "Anonymous",
        email: customer.email,
        tenantId: tenant.id,
        totalSpent: parseFloat(customer.total_spent || "0"),
      },
    });

    await prisma.event.create({
      data: {
        tenantId: tenant.id,
        type: "customer_updated",
        payload: formatCustomer(customer),
        customerId: dbCustomer.id,
      },
    });

    res.status(200).send("OK");
  } catch (err: any) {
    console.error("❌ Webhook customer update error:", err.message);
    res.status(500).json({ error: err.message || "Failed to update customer" });
  }
});

/**
 * ---------------- Products ----------------
 */
router.post("/products/create", async (req, res) => {
  try {
    const tenant = await resolveTenant(req);
    const product = req.body;

    await prisma.product.upsert({
      where: { shopifyId: String(product.id) },
      update: {
        title: product.title,
        price: parseFloat(product.variants?.[0]?.price || "0"),
      },
      create: {
        shopifyId: String(product.id),
        title: product.title,
        price: parseFloat(product.variants?.[0]?.price || "0"),
        tenantId: tenant.id,
      },
    });

    await prisma.event.create({
      data: {
        tenantId: tenant.id,
        type: "product_created",
        payload: formatProduct(product),
      },
    });

    res.status(200).send("OK");
  } catch (err: any) {
    console.error("❌ Webhook product create error:", err.message);
    res.status(500).json({ error: err.message || "Failed to sync product" });
  }
});

router.post("/products/update", async (req, res) => {
  try {
    const tenant = await resolveTenant(req);
    const product = req.body;

    await prisma.product.upsert({
      where: { shopifyId: String(product.id) },
      update: {
        title: product.title,
        price: parseFloat(product.variants?.[0]?.price || "0"),
      },
      create: {
        shopifyId: String(product.id),
        title: product.title,
        price: parseFloat(product.variants?.[0]?.price || "0"),
        tenantId: tenant.id,
      },
    });

    await prisma.event.create({
      data: {
        tenantId: tenant.id,
        type: "product_updated",
        payload: formatProduct(product),
      },
    });

    res.status(200).send("OK");
  } catch (err: any) {
    console.error("❌ Webhook product update error:", err.message);
    res.status(500).json({ error: err.message || "Failed to update product" });
  }
});

/**
 * ---------------- Checkouts ----------------
 */
router.post("/checkouts/update", async (req, res) => {
  try {
    const tenant = await resolveTenant(req);
    const checkout = req.body;

    let customerId: string | null = null;
    if (checkout.customer?.id) {
      const dbCustomer = await prisma.customer.upsert({
        where: { shopifyId: String(checkout.customer.id) },
        update: {
          name:
            `${checkout.customer.first_name || ""} ${
              checkout.customer.last_name || ""
            }`.trim() || "Anonymous",
          email: checkout.customer.email,
        },
        create: {
          shopifyId: String(checkout.customer.id),
          name:
            `${checkout.customer.first_name || ""} ${
              checkout.customer.last_name || ""
            }`.trim() || "Anonymous",
          email: checkout.customer.email,
          tenantId: tenant.id,
          totalSpent: 0,
        },
      });
      customerId = dbCustomer.id;
    }

    await prisma.event.create({
      data: {
        tenantId: tenant.id,
        type: checkout.abandoned_checkout_url
          ? "cart_abandoned"
          : "checkout_started",
        payload: formatCheckout(checkout),
        customerId,
      },
    });

    res.status(200).send("OK");
  } catch (err: any) {
    console.error(" Webhook checkout error:", err.message);
    res
      .status(500)
      .json({ error: err.message || "Failed to handle checkout event" });
  }
});

export default router;
