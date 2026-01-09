import express from "express";
import multer from "multer";
import pdf from "pdf-parse";
import fs from "fs/promises";
import { Chunk } from "../models/Chunk.js";
import { getEmbedding } from "../utils/embedding.js";
import { splitText } from "../utils/splitText.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

/**
 * POST /api/upload
 */
router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No PDF file uploaded" });
    }

    const dataBuffer = await fs.readFile(req.file.path);
    const pdfData = await pdf(dataBuffer);

    const text = pdfData.text;
    const chunks = splitText(text, 1000, 200);

    let chunkIndex = 0;

    for (const chunk of chunks) {
      const embedding = await getEmbedding(chunk);

      await Chunk.create({
        text: chunk,
        embedding,
        source: req.file.originalname,
        chunkIndex,
      });

      chunkIndex++;
    }

    await fs.unlink(req.file.path);

    res.json({
      success: true,
      chunks: chunkIndex,
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "PDF upload failed" });
  }
});

export default router;
