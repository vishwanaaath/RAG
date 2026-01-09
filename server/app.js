import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import uploadRoutes from "./routes/upload.routes.js";
import historyRoutes from "./routes/history.js";
import askRoutes from "./routes/ask.routes.js";
import usersRoutes from "./routes/users.routes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/upload", uploadRoutes);
app.use("/api/ask", askRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/users", usersRoutes);


// MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
