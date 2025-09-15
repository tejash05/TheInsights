import { getShopifyClient } from "../config/shopify";
import prisma from "../config/db";

export async function ingestShopifyData(
  tenantId: string,
  shop: string,
  accessToken: string
) {
  const shopify = getShopifyClient(shop, accessToken);

  let customerCount = 0;
  let orderCount = 0;
  let productCount = 0;

  // ---------------- Customers ----------------
  const customers = await shopify.customer.list();
  for (const c of customers) {
    await prisma.customer.upsert({
      where: { shopifyId: String(c.id) },
      update: {
        name: `${c.first_name || ""} ${c.last_name || ""}`.trim() || "Anonymous",
        email: c.email,
        totalSpent: parseFloat(c.total_spent || "0"),
      },
      create: {
        shopifyId: String(c.id),
        name: `${c.first_name || ""} ${c.last_name || ""}`.trim() || "Anonymous",
        email: c.email,
        tenantId,
        totalSpent: parseFloat(c.total_spent || "0"),
      },
    });
  }
  customerCount = customers.length;

  // ---------------- Orders + OrderItems ----------------
  const orders = await shopify.order.list();
  for (const o of orders) {
    // 🔑 Fetch full order details (ensures line_items are included)
    const fullOrder = await shopify.order.get(o.id);

    let customerRecord = null;
    if (fullOrder.customer?.id) {
      customerRecord = await prisma.customer.upsert({
        where: { shopifyId: String(fullOrder.customer.id) },
        update: {
          name:
            `${fullOrder.customer.first_name || ""} ${
              fullOrder.customer.last_name || ""
            }`.trim() || "Anonymous",
          email: fullOrder.customer.email,
        },
        create: {
          shopifyId: String(fullOrder.customer.id),
          name:
            `${fullOrder.customer.first_name || ""} ${
              fullOrder.customer.last_name || ""
            }`.trim() || "Anonymous",
          email: fullOrder.customer.email,
          tenantId,
          totalSpent: 0,
        },
      });
    }

    const orderRecord = await prisma.order.upsert({
      where: { shopifyId: String(fullOrder.id) },
      update: {
        total: parseFloat(fullOrder.total_price || "0"),
        customerId: customerRecord?.id || null,
      },
      create: {
        shopifyId: String(fullOrder.id),
        total: parseFloat(fullOrder.total_price || "0"),
        tenantId,
        customerId: customerRecord?.id || null,
      },
    });

    // Save line items
    if (fullOrder.line_items && fullOrder.line_items.length > 0) {
      for (const li of fullOrder.line_items) {
        const productShopifyId = li.product_id
          ? String(li.product_id)
          : `line-${li.id}`;

        // Ensure product exists
        const productRecord = await prisma.product.upsert({
          where: { shopifyId: productShopifyId },
          update: { title: li.name },
          create: {
            shopifyId: productShopifyId,
            title: li.name,
            price: parseFloat(li.price || "0"), // unit price
            tenantId,
          },
        });

        const lineTotal =
          parseFloat(li.price || "0") * (li.quantity || 1);

        await prisma.orderItem.upsert({
          where: { shopifyLineId: String(li.id) },
          update: {
            quantity: li.quantity || 1,
            price: lineTotal,
          },
          create: {
            shopifyLineId: String(li.id),
            orderId: orderRecord.id,
            productId: productRecord.id,
            quantity: li.quantity || 1,
            price: lineTotal,
          },
        });

        console.log(
          `✅ Saved OrderItem: product=${productRecord.title}, qty=${li.quantity}, total=${lineTotal}`
        );
      }
    } else {
      console.log(`⚠️ Order ${fullOrder.id} has no line_items`);
    }
  }
  orderCount = orders.length;

  // ---------------- Recalculate customer totals ----------------
  const allCustomers = await prisma.customer.findMany({ where: { tenantId } });
  for (const cust of allCustomers) {
    const agg = await prisma.order.aggregate({
      where: { tenantId, customerId: cust.id },
      _sum: { total: true },
    });
    await prisma.customer.update({
      where: { id: cust.id },
      data: { totalSpent: agg._sum.total || 0 },
    });
  }

  // ---------------- Products (catalog sync) ----------------
  const products = await shopify.product.list();
  for (const p of products) {
    await prisma.product.upsert({
      where: { shopifyId: String(p.id) },
      update: {
        title: p.title,
        price: parseFloat(p.variants?.[0]?.price || "0"),
      },
      create: {
        shopifyId: String(p.id),
        title: p.title,
        price: parseFloat(p.variants?.[0]?.price || "0"),
        tenantId,
      },
    });
  }
  productCount = products.length;

  // ---------------- Draft Orders ----------------
const drafts = await shopify.draftOrder.list();

for (const d of drafts) {
  let customerId: string | null = null;

  if (d.customer?.id) {
    // Try to resolve the customer in our DB
    const dbCustomer = await prisma.customer.findUnique({
      where: { shopifyId: String(d.customer.id) },
    });

    if (dbCustomer) {
      customerId = dbCustomer.id;
    } else {
      // 👇 Optional: create stub customer if not already ingested
      const newCustomer = await prisma.customer.create({
        data: {
          shopifyId: String(d.customer.id),
          name:
            `${d.customer.first_name || ""} ${
              d.customer.last_name || ""
            }`.trim() || "Anonymous",
          email: d.customer.email,
          tenantId,
          totalSpent: 0,
        },
      });
      customerId = newCustomer.id;
    }
  }

  await prisma.event.create({
    data: {
      tenantId,
      type: "DRAFT_ORDER",
      payload: {
        draftId: String(d.id),
        total: d.total_price,
        status: d.status,
      },
      customerId, // ✅ now points to valid DB customer or null
    },
  });
}


  return {
    success: true,
    customers: customerCount,
    orders: orderCount,
    products: productCount,
  };
}
