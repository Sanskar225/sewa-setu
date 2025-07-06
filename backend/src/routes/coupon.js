// routes/coupons.js
import express from "express";
import { PrismaClient } from "@prisma/client";
import { isAdmin } from "../middlewares/isAdmin.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();
const prisma = new PrismaClient();

// Create a new coupon (Admin)
router.post("/", authMiddleware, isAdmin, async (req, res) => {
  try {
    const { code, discount, maxAmount, expiryDate } = req.body;
    const coupon = await prisma.coupon.create({
      data: { code, discount, maxAmount, expiryDate, isActive: true },
    });
    res.status(201).json({ coupon });
  } catch (error) {
    console.error("Error creating coupon:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get all active coupons
router.get("/", authMiddleware, async (req, res) => {
  try {
    const coupons = await prisma.coupon.findMany({
      where: { isActive: true, expiryDate: { gt: new Date() } },
      orderBy: { expiryDate: "asc" },
    });
    res.status(200).json({ coupons });
  } catch (error) {
    console.error("Error fetching coupons:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;