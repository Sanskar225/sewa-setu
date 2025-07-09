// index.js
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import Redis from "ioredis";
import { PrismaClient } from "@prisma/client";

// Routes
import userRoutes from "./routes/user.js";
import providerProfileRoutes from "./routes/providerProfile.js";
import availabilityRoutes from "./routes/availabilitySlot.js";
import bookingRoutes from "./routes/booking.js";
import walletRoutes from "./routes/wallet.js";
import fileRoutes from "./routes/files.js";
import categoryRoutes from "./routes/categoryService.js";
import couponRoutes from "./routes/coupon.js";
import reviewRoutes from "./routes/reviews.js";
import messageRoutes from "./routes/messages.js";
import notificationRoutes from "./routes/notification.js";
// import authRoutes from "./routes/user.js";
import matchRoutes from "./routes/match.js";

// Socket handler
import { setupMatchingSocket } from "./socket/matchHandler.js";

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Change to your frontend domain in production
    methods: ["GET", "POST"],
  },
});

// Redis & Prisma
const redis = new Redis(process.env.REDIS_URL);
const prisma = new PrismaClient();

// Middlewares
app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.send("✅ UrbanCo-style API running");
});

// Routes
// app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/provider-profile", providerProfileRoutes);
app.use("/api/v1/availability", availabilityRoutes);
app.use("/api/v1/booking", bookingRoutes);
app.use("/api/v1/wallet", walletRoutes);
app.use("/api/v1/files", fileRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/coupons", couponRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/messages", messageRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/match", matchRoutes); // optional REST fallback

// Socket.io setup
setupMatchingSocket(io);

// Redis connection check
redis.ping().then((res) => {
  console.log("🔁 Redis ping:", res);
}).catch((err) => {
  console.error("❌ Redis connection failed:", err);
});

// Start server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
