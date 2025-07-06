import express from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { providerProfileSchema } from "../validators/ValidateUser.js";

const router = express.Router();
const prisma = new PrismaClient();

/**
 * @route   GET /api/provider-profile
 * @desc    Get current provider's profile
 * @access  Private
 */
router.get("/", authMiddleware, async (req, res) => {
  const userId = req.user.id;

  try {
    const profile = await prisma.providerProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return res.status(404).json({ message: "Provider profile not found" });
    }

    return res.status(200).json({ profile });
  } catch (error) {
    console.error("Error fetching provider profile:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * @route   POST /api/provider-profile
 * @desc    Create or update provider profile
 * @access  Private
 */
router.post("/", authMiddleware, async (req, res) => {
  const userId = req.user.id;

  const parsed = providerProfileSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.errors });
  }

  try {
    const existing = await prisma.providerProfile.findUnique({ where: { userId } });

    const data = {
      ...parsed.data,
      userId,
    };

    let profile;
    if (existing) {
      profile = await prisma.providerProfile.update({
        where: { userId },
        data,
      });
    } else {
      profile = await prisma.providerProfile.create({ data });
    }

    return res.status(200).json({ message: "Profile saved successfully", profile });
  } catch (error) {
    console.error("Error saving provider profile:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * @route   GET /api/provider-profile/all
 * @desc    Get all provider profiles (admin or public search)
 * @access  Public or Admin
 */
router.get("/all", async (req, res) => {
  try {
    const providers = await prisma.providerProfile.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    return res.status(200).json({ providers });
  } catch (error) {
    console.error("Error fetching providers:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
