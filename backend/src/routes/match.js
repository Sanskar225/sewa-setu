// routes/match.js
import express from "express";
import { PrismaClient } from "@prisma/client";
import { haversineDistance } from "../controllers/geoHelpers.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();
const prisma = new PrismaClient();

router.post("/nearby", authMiddleware, async (req, res) => {
  const { latitude, longitude, radiusKm = 10 } = req.body;

  try {
    const providers = await prisma.providerProfile.findMany({
      where: {
        availability: true,
        verified: true
      }
    });

    const nearby = providers.filter((p) => {
      const dist = haversineDistance(latitude, longitude, p.latitude, p.longitude);
      return dist <= radiusKm;
    });

    res.json({ nearby });
  } catch (error) {
    console.error("Geo Match Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
