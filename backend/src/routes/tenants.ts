import { Router } from "express";
import prisma from "../config/db";

const router = Router();

router.post("/", async (req, res) => {
  const { name, shopifyShop, accessToken } = req.body;
  if (!name || !shopifyShop || !accessToken) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    const tenant = await prisma.tenant.create({
      data: { name, shopifyShop, accessToken },
    });
    res.json(tenant);
  } catch (err: any) {
    console.error("Tenant creation error:", err); // will show in terminal

    res.status(500).json({
      error: "Failed to create tenant",
      details: err.message || JSON.stringify(err),
    });
  }
});


export default router;
