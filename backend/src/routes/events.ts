import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

// ---------------- Create Event ----------------
router.post("/", async (req, res) => {
  const { tenantId, type, payload, customerId } = req.body;
  if (!tenantId || !type) {
    return res.status(400).json({ error: "Missing tenantId or type" });
  }

  try {
    const event = await prisma.event.create({
      data: {
        tenantId,
        type,
        payload: payload || {},
        customerId: customerId || null, // optional link to customer
      },
    });

    res.json({
      id: event.id,
      type: event.type,
      createdAt: event.createdAt,
      customerId: customerId
        ? `•••${String(customerId).slice(-4)}`
        : "Unknown",
      payload: event.payload,
    });
  } catch (err: any) {
    console.error("❌ Event creation error:", err);
    res
      .status(500)
      .json({ error: err.message || "Failed to create event" });
  }
});

// ---------------- Get Events ----------------
router.get("/", async (req, res) => {
  const { tenantId } = req.query;
  if (!tenantId) {
    return res.status(400).json({ error: "Missing tenantId" });
  }

  try {
    const events = await prisma.event.findMany({
      where: { tenantId: String(tenantId) },
      include: { customer: true }, // 👈 get customer info if linked
      orderBy: { createdAt: "desc" },
    });

    const formatted = events.map((e) => ({
      id: e.id,
      type: e.type,
      createdAt: e.createdAt,
      customerId: e.customer?.shopifyId
        ? `•••${e.customer.shopifyId.slice(-4)}`
        : "Unknown",
      payload: e.payload,
    }));

    res.json(formatted);
  } catch (err: any) {
    console.error("❌ Fetch events error:", err);
    res
      .status(500)
      .json({ error: err.message || "Failed to fetch events" });
  }
});

export default router;
