import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import userRouter from "./routes/user.js";
import walletRouter from "./routes/wallet.js";
import socketRouter from "./routes/socket.js";
import reviewsRouter from "./routes/reviews.js";
import provideProfileRouter from "./routes/providerProfile.js";
import notificationRouter from "./routes/notification.js";
import messagesRouter from "./routes/messages.js";
import matchRouter from "./routes/match.js";
import filesRouter from "./routes/files.js";
import couponRouter from "./routes/coupon.js";
import categoryServiceRouter from "./routes/categoryService.js";
import bookingRouter from "./routes/booking.js";
import availabilitySlotRouter from "./routes/availabilitySlot.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Parichay backend is running ✅");
});

app.use("/api/v1/users", userRouter);
app.use("/api/v1/wallet", walletRouter);
app.use("/api/v1/socket", socketRouter);
app.use("/api/v1/reviews", reviewsRouter);
app.use("/api/v1/provideProfile", providerProfileRouter);
app.use("/api/v1/notifications", notificationRouter);
app.use("/api/v1/messages", messagesRouter);
app.use("/api/v1/match", matchRouter);
app.use("/api/v1/files", filesRouter);
app.use("/api/v1/coupon", couponRouter);
app.use("/api/v1/categoryServices", categoryServiceRouter);
app.use("/api/v1/bookings", bookingRouter);
app.use("/api/v1/availabilitySlots", availabilitySlotRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
