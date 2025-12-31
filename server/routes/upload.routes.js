// routes/upload.routes.js
import express from "express";
import multer from "multer";
import { ingestDocument } from "../controllers/ingestion.controller.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (_, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (_, file, cb) => {
    if (file.mimetype === "application/pdf") cb(null, true);
    else cb(new Error("Only PDFs allowed"));
  },
});

router.post("/upload", upload.single("file"), ingestDocument);

export default router;
