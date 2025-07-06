// routes/serviceCategory.js
import express from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = express.Router();
const prisma = new PrismaClient();

// Get all categories
router.get("/", async (req, res) => {
  try {
    const categories = await prisma.serviceCategory.findMany();
    res.status(200).json({ categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Admin: create new category
router.post("/", authMiddleware, isAdmin, async (req, res) => {
  try {
    const { name, image } = req.body;
    const category = await prisma.serviceCategory.create({ data: { name, image } });
    res.status(201).json({ category });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
