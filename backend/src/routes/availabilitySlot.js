import express from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { availabilitySlotSchema } from "../validators/ValidateUser.js";

const router = express.Router();
const prisma = new PrismaClient();

// 🔸 Create availability slot
router.post("/", authMiddleware, async (req, res) => {
  const providerId = req.user.id;

  const parsed = availabilitySlotSchema.safeParse({ ...req.body, providerId });
  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.errors });
  }

  try {
    const slot = await prisma.availabilitySlot.create({
      data: parsed.data,
    });

    res.status(201).json({ message: "Slot created", slot });
  } catch (error) {
    console.error("Error creating slot:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// 🔸 Get all slots for current provider
router.get("/", authMiddleware, async (req, res) => {
  try {
    const slots = await prisma.availabilitySlot.findMany({
      where: { providerId: req.user.id },
      orderBy: { startTime: "asc" },
    });

    res.status(200).json({ slots });
  } catch (error) {
    console.error("Error fetching slots:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// 🔸 Delete a slot
router.delete("/:slotId", authMiddleware, async (req, res) => {
  const { slotId } = req.params;

  try {
    const slot = await prisma.availabilitySlot.findUnique({
      where: { id: slotId },
    });

    if (!slot || slot.providerId !== req.user.id) {
      return res.status(404).json({ message: "Slot not found or unauthorized" });
    }

    await prisma.availabilitySlot.delete({ where: { id: slotId } });

    res.status(200).json({ message: "Slot deleted" });
  } catch (error) {
    console.error("Error deleting slot:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
