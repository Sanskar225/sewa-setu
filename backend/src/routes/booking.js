import express from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { bookingSchema } from "../validators/ValidateUser.js";

const router = express.Router();
const prisma = new PrismaClient();

// 🔸 Create a new booking
router.post("/", authMiddleware, async (req, res) => {
  const parsed = bookingSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.errors });
  }

  try {
    const booking = await prisma.booking.create({
      data: {
        ...parsed.data,
        dateTime: new Date(parsed.data.dateTime),
      },
    });

    res.status(201).json({ message: "Booking created", booking });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// 🔸 Get all bookings made by user
router.get("/my-bookings", authMiddleware, async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { userId: req.user.id },
      include: { provider: true },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({ bookings });
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// 🔸 Get all jobs (for provider)
router.get("/my-jobs", authMiddleware, async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { providerId: req.user.id },
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({ bookings });
  } catch (error) {
    console.error("Error fetching provider jobs:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// 🔸 Update booking status (ACCEPTED / COMPLETED / CANCELLED)
router.put("/:bookingId/status", authMiddleware, async (req, res) => {
  const { bookingId } = req.params;
  const { status } = req.body;

  if (!["ACCEPTED", "COMPLETED", "CANCELLED"].includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  try {
    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status },
    });

    res.status(200).json({ message: "Booking updated", booking });
  } catch (error) {
    console.error("Error updating booking:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
