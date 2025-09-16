import "dotenv/config"; // 👈 load .env first
import express, { Request, Response } from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import webhookRoutes from "./routes/webhooks";
import eventRoutes from "./routes/events";
import { registerWebhooks } from "./services/registerWebhooks";
import resyncRoutes from "./routes/resync";
import "./scheduler";
import orderRoutes from "./routes/orders"; // ✅ dedicated file for orders

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 4000;

// ✅ Allow frontend requests (from .env FRONTEND_URL)
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());
app.use("/webhooks", webhookRoutes);
app.use("/events", eventRoutes);
app.use("/resync", resyncRoutes);
app.use("/orders", orderRoutes); // ✅ use cleaned orders routes

// ---------------- Debug ----------------
app.get("/ping", (_req: Request, res: Response) => {
  res.send("✅ Express + Prisma is working");
});

// ---------------- Login ----------------
app.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Missing email or password" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { tenant: true },
    });

    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ error: "Invalid credentials" });

    res.json({ id: user.id, email: user.email, tenantId: user.tenantId });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
});

// ---------------- Registration ----------------
app.post("/register", async (req: Request, res: Response) => {
  const { email, password, shopifyShop, accessToken } = req.body;
  if (!email || !password || !shopifyShop || !accessToken) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const tenant = await prisma.tenant.create({
      data: { name: email, shopifyShop, accessToken },
    });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { email, password: hashedPassword, tenantId: tenant.id },
    });

    // 🔹 Register Shopify webhooks for this tenant
    await registerWebhooks(tenant.id, shopifyShop, accessToken);

    res.json({
      message: "Tenant + User registered successfully",
      tenantId: tenant.id,
      email: user.email,
    });
  } catch (err: any) {
    console.error("❌ Registration error:", err);
    res.status(500).json({ error: err.message || "Failed to register tenant" });
  }
});

// ---------------- Tenants ----------------
app.post("/tenants", async (req: Request, res: Response) => {
  const { name, shopifyShop, accessToken, domain } = req.body;
  if (!name || !shopifyShop || !accessToken) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    const tenant = await prisma.tenant.create({
      data: { name, shopifyShop, accessToken, domain: domain || null },
    });

    // 🔹 Auto-register webhooks when tenant is created manually
    await registerWebhooks(tenant.id, shopifyShop, accessToken);

    res.json(tenant);
  } catch (err: any) {
    console.error("❌ Tenant creation error:", err);
    res
      .status(500)
      .json({ error: err.message || "Failed to create tenant" });
  }
});

app.get("/tenants", async (_req: Request, res: Response) => {
  try {
    const tenants = await prisma.tenant.findMany();
    res.json(tenants);
  } catch (err: any) {
    console.error("❌ Fetch tenants error:", err);
    res.status(500).json({ error: err.message || "Failed to fetch tenants" });
  }
});

// ---------------- Customers ----------------
app.get("/customers", async (req: Request, res: Response) => {
  const { tenantId } = req.query;
  if (!tenantId) return res.status(400).json({ error: "Missing tenantId" });

  try {
    const customers = await prisma.customer.findMany({
      where: { tenantId: String(tenantId) },
      include: { orders: true },
      orderBy: { totalSpent: "desc" },
    });

    const formatted = customers.map((c) => ({
      customerId: c.shopifyId,
      last4Id: `•••${c.shopifyId.slice(-4)}`,
      name: c.name,
      email: c.email,
      ordersCount: c.orders.length,
      totalSpent: c.totalSpent,
    }));

    res.json(formatted);
  } catch (err: any) {
    console.error("❌ Fetch customers error:", err);
    res.status(500).json({ error: err.message || "Failed to fetch customers" });
  }
});

app.get("/customers/stats", async (req: Request, res: Response) => {
  const { tenantId } = req.query;
  if (!tenantId) return res.status(400).json({ error: "Missing tenantId" });

  try {
    const topCustomers = await prisma.customer.findMany({
      where: { tenantId: String(tenantId) },
      include: { orders: true },
    });

    const enriched = topCustomers.map((c) => {
      const total =
        c.totalSpent || c.orders.reduce((sum, o) => sum + o.total, 0);
      return {
        customerId: c.shopifyId,
        last4Id: `•••${c.shopifyId.slice(-4)}`,
        name: c.name,
        email: c.email,
        ordersCount: c.orders.length,
        totalSpent: total,
      };
    });

    const sorted = enriched
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 5);
    res.json(sorted);
  } catch (err: any) {
    console.error("❌ Customer stats error:", err);
    res.status(500).json({ error: err.message || "Failed to fetch stats" });
  }
});

// ---------------- Products ----------------
app.get("/products", async (req: Request, res: Response) => {
  const { tenantId } = req.query;
  if (!tenantId) return res.status(400).json({ error: "Missing tenantId" });

  try {
    const products = await prisma.product.findMany({
      where: { tenantId: String(tenantId) },
      orderBy: { price: "desc" },
    });
    res.json(products);
  } catch (err: any) {
    console.error("❌ Fetch products error:", err);
    res.status(500).json({ error: err.message || "Failed to fetch products" });
  }
});

// ---------------- Products Stats ----------------
app.get("/products/stats", async (req: Request, res: Response) => {
  const { tenantId } = req.query;
  if (!tenantId) return res.status(400).json({ error: "Missing tenantId" });

  try {
    const tenantOrders = await prisma.order.findMany({
      where: { tenantId: String(tenantId) },
      select: { id: true },
    });

    const orderIds = tenantOrders.map((o) => o.id);

    // ⚡ Fallback: if no orders, return top 5 catalog products
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

    const grouped = await prisma.orderItem.groupBy({
      by: ["productId"],
      _sum: { quantity: true, price: true },
      where: { orderId: { in: orderIds } },
    });

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

    const topProducts = results
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
    res.json(topProducts);
  } catch (err: any) {
    console.error("❌ Products stats error:", err);
    res
      .status(500)
      .json({ error: err.message || "Failed to fetch product stats" });
  }
});

// ---------------- Overview ----------------
app.get("/overview", async (req: Request, res: Response) => {
  const { tenantId } = req.query;
  if (!tenantId) return res.status(400).json({ error: "Missing tenantId" });

  try {
    const totalCustomers = await prisma.customer.count({
      where: { tenantId: String(tenantId) },
    });

    const totalOrders = await prisma.order.count({
      where: { tenantId: String(tenantId) },
    });

    const totalRevenueAgg = await prisma.order.aggregate({
      where: { tenantId: String(tenantId) },
      _sum: { total: true },
    });

    res.json({
      totalCustomers,
      totalOrders,
      totalRevenue: totalRevenueAgg._sum.total || 0,
    });
  } catch (err: any) {
    console.error("❌ Overview fetch error:", err);
    res
      .status(500)
      .json({ error: err.message || "Failed to fetch overview" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
