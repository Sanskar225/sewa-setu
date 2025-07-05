// File: routes/auth.ts
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { PrismaClient } from '@prisma/client';
import Redis from "ioredis";
import { loginSchema, signupSchema, updateProfileSchema } from "../validators/ValidateUser.js";
import { error } from "console";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/isAdmin.js";

dotenv.config();

const router = express.Router();
const prisma = new PrismaClient();
const redis = new Redis("redis://default:BDlobEnST3f4r66Gi5oJaIYK2nkUGXDE@redis-17225.crce179.ap-south-1-1.ec2.redns.redis-cloud.com:17225");
redis.ping().then(console.log); // Should log 'PONG'


// ✅ Nodemailer setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const otpHtmlTemplate = (otp) => `
  <div style="font-family: Arial, sans-serif; padding: 20px;">
    <h2 style="color: #007bff;">🔐 Your Verification Code</h2>
    <p>Use the following OTP to verify your identity:</p>
    <h1 style="letter-spacing: 4px; color: #222;">${otp}</h1>
    <p>This code will expire in 10 minutes.</p>
    <br/>
    <p>Thank you,<br/><strong>SewaSetu Team</strong></p>
  </div>
`;


// ✅ Route to generate OTP (PHONE)
router.post("/generate-otp-phone", async (req, res) => {
  const phone = req.body.phone;
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

  await redis.set(`otp:phone:${phone}`, otpCode, "EX", 600);

  // Integrate with SMS service (e.g., Twilio, MSG91)
  console.log(`✅ Send OTP ${otpCode} to phone: ${phone}`);

  res.json({ message: "OTP sent to phone!" });
});

// ✅ Route to verify OTP (PHONE)
router.post("/verify-otp-phone", async (req, res) => {
  const { phone, code } = req.body;
  const storedOtp = await redis.get(`otp:phone:${phone}`);

  if (!storedOtp || storedOtp !== code) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  await redis.del(`otp:phone:${phone}`);
  await redis.set(`verified:phone:${phone}`, "true", "EX", 600);
  res.json({ message: "Phone OTP verified. You can now sign up." });
});



// ✅ Check if admin already exists
router.get("/check-admin", async (req, res) => {
  try {
    const adminCount = await prisma.user.count({
      where: { role: "ADMIN" }
    });

    res.status(200).json({
      adminExists: adminCount > 0,
      adminCount,
    });
  } catch (error) {
    console.error("Error checking admin existence:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// ✅ Check if a user with given email exists
router.get("/check-user", async (req, res) => {
  const email = req.query.email?.toString().toLowerCase();

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });

    res.status(200).json({ exists: !!existingUser });
  } catch (error) {
    console.error("Error checking user existence:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ Signup route (with OTP check)
router.post("/signup", async (req, res) => {
  try {
    const parsed = signupSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(403).json({ errors: parsed.error.errors });
    }

    const { email: rawEmail, name, password, role } = parsed.data;
    const email = rawEmail.toLowerCase(); // 🔥 Normalize email early

      // Use lowercased email consistently below
      const isVerified = await redis.get(`verified:${email}`);

      console.log("Checking verified status for:", email);
      console.log("Verified value in Redis:", isVerified);
      if (!isVerified) {
        return res.status(403).json({ message: "Please verify your email via OTP before signing up." });
      }


      // 🔒 Check if admin already exists
      if (role === "ADMIN") {
        const adminCount = await prisma.user.count({
          where: { role: "ADMIN" },
        });

        if (adminCount > 0) {
          return res.status(403).json({
            message: "Admin already exists. Only one admin is allowed per system.",
          });
        }
      }



    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: role ?? "USER",
      },
    });

    const token = jwt.sign({ 
        id: user.id, 
        role: user.role },
        process.env.JWT_SECRET || "secret",
      { expiresIn: "1h" }
    );

    await redis.del(`verified:${email}`);

    return res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (e) {
    console.log(error)
    console.error(e);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ Signin route
router.post("/signin", async (req, res) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ errors: parsed.error.errors, message: "Invalid credentials" });
    }

    const user = await prisma.user.findUnique({
      where: { email: parsed.data.email },
    });

    if (!user) {
      return res.status(403).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(parsed.data.password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1h" }
    );

    // Return user without password
    const { password, ...userWithoutPassword } = user;

    res.json({
      message: "Login successful",
      jwt: token,
      user: userWithoutPassword, // 👈 now frontend gets proper user object
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Login failed due to server error" });
  }
});



// Delete User route
router.delete("/user", authMiddleware, isAdmin, async (req, res) => {
  try {
    const parsed = deleteUserSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ errors: parsed.error.errors });
    }

    const { userId } = parsed.data;

    await prisma.user.delete({
      where: { id: userId },
    });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
})

// GET /me - get currently logged in user's profile
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id; // Comes from authMiddleware

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user info:", error);
    res.status(500).json({ message: "Failed to fetch user info" });
  }
});

router.get("/users", authMiddleware, isAdmin, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
      orderBy: {
        createdAt: "desc", // optional, if you want newest users first
      },
    });

    res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


// PUT /update-profile - update name or password
router.put("/update-profile", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const parsed = updateProfileSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ errors: parsed.error.errors });
    }

    const { name, password } = parsed.data;
    const updateData = {};

    if (name) updateData.name = name;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    res.status(200).json({ message: "Profile updated", user: updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


export default router;
