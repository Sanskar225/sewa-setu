import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRouter from "./routes/user.js";
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Parichay backend is running ✅");
});

app.use("/api/v1/users", userRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
