// routes/messages.js
import express from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();
const prisma = new PrismaClient();

// Get all messages for a conversation
router.get("/:receiverId", authMiddleware, async (req, res) => {
  try {
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: req.user.id, receiverId: req.params.receiverId },
          { senderId: req.params.receiverId, receiverId: req.user.id },
        ],
      },
      orderBy: { createdAt: "asc" },
    });
    res.status(200).json({ messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Send a message
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { receiverId, content } = req.body;
    const message = await prisma.message.create({
      data: {
        senderId: req.user.id,
        receiverId,
        content,
      },
    });
    res.status(201).json({ message });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;