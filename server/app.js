// app.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import uploadRoutes from "./routes/upload.routes.js";

dotenv.config();

const app = express();

/* ------------------ Middleware ------------------ */
app.use(
  cors({
    origin: "http://localhost:3000", // React frontend
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ------------------ Routes ------------------ */
app.use("/api", uploadRoutes);

/* ------------------ Health Check ------------------ */
app.get("/", (_, res) => {
  res.json({ status: "Knowledge Ingestion API running" });
});

/* ------------------ MongoDB ------------------ */
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB Atlas connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

/* ------------------ Server ------------------ */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
