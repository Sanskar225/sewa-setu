import express from "express";
import { PrismaClient } from "@prisma/client";
import { reviewSchema } from "../validators/ValidateUser.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();
const prisma = new PrismaClient();

// 🔹 Create a review
router.post("/", authMiddleware, async (req, res) => {
  const parsed = reviewSchema.safeParse({
    ...req.body,
    userId: req.user.id,
  });

  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.errors });
  }

  const { providerId, rating, comment } = parsed.data;

  try {
    const review = await prisma.review.create({
      data: {
        userId: req.user.id,
        providerId,
        rating,
        comment,
      },
    });

    res.status(201).json({ message: "Review submitted", review });
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// 🔹 Get reviews for a provider
router.get("/provider/:providerId", async (req, res) => {
  const providerId = req.params.providerId;

  try {
    const reviews = await prisma.review.findMany({
      where: { providerId },
      include: {
        user: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({ reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// 🔹 Optional: Get average rating of a provider
router.get("/provider/:providerId/average", async (req, res) => {
  const providerId = req.params.providerId;

  try {
    const result = await prisma.review.aggregate({
      where: { providerId },
      _avg: { rating: true },
    });

    res.status(200).json({ averageRating: result._avg.rating ?? 0 });
  } catch (error) {
    console.error("Error calculating average rating:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router