import express from "express";
import multer from "multer";
import { PrismaClient } from "@prisma/client";
import { fileSchema } from "../validators/ValidateUser.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { v4 as uuidv4 } from "uuid";
import path from "path";

const router = express.Router();
const prisma = new PrismaClient();

// Setup Multer (local storage)
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});

const upload = multer({ storage });

// 🔹 Upload a file
router.post(
  "/upload",
  authMiddleware,
  upload.single("file"),
  async (req, res) => {
    const { type } = req.body;

    const parsed = fileSchema.safeParse({
      userId: req.user.id,
      url: `/uploads/${req.file.filename}`,
      type,
    });

    if (!parsed.success) {
      return res.status(400).json({ errors: parsed.error.errors });
    }

    try {
      const uploaded = await prisma.file.create({
        data: parsed.data,
      });

      res.status(201).json({ message: "File uploaded", file: uploaded });
    } catch (error) {
      console.error("Error saving file:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// 🔹 Get files by user
router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const files = await prisma.file.findMany({
      where: { userId },
    });

    res.status(200).json({ files });
  } catch (error) {
    console.error("Error fetching files:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
