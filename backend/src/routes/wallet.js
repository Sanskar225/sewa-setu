import express from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { walletTransactionSchema } from "../validators/ValidateUser.js";

const router = express.Router();
const prisma = new PrismaClient();

// 🔹 Get current wallet balance
router.get("/", authMiddleware, async (req, res) => {
  try {
    let wallet = await prisma.wallet.findUnique({
      where: { userId: req.user.id },
    });

    // Auto-create wallet if not exists
    if (!wallet) {
      wallet = await prisma.wallet.create({
        data: { userId: req.user.id },
      });
    }

    res.status(200).json({ wallet });
  } catch (error) {
    console.error("Error fetching wallet:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// 🔹 View wallet transactions
router.get("/transactions", authMiddleware, async (req, res) => {
  try {
    const transactions = await prisma.walletTransaction.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({ transactions });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// 🔹 Top up wallet
router.post("/topup", authMiddleware, async (req, res) => {
  const parsed = walletTransactionSchema.safeParse({
    ...req.body,
    userId: req.user.id,
    type: "CREDIT",
    source: "TOPUP",
  });

  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.errors });
  }

  const { amount } = parsed.data;

  try {
    // Ensure wallet exists
    let wallet = await prisma.wallet.findUnique({
      where: { userId: req.user.id },
    });

    if (!wallet) {
      wallet = await prisma.wallet.create({
        data: { userId: req.user.id },
      });
    }

    // Create transaction
    await prisma.walletTransaction.create({
      data: {
        userId: req.user.id,
        amount,
        type: "CREDIT",
        source: "TOPUP",
      },
    });

    // Update balance
    await prisma.wallet.update({
      where: { userId: req.user.id },
      data: { balance: wallet.balance + amount },
    });

    res.status(200).json({ message: "Wallet topped up successfully" });
  } catch (error) {
    console.error("Error topping up wallet:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router