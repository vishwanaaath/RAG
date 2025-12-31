// controllers/ingestion.controller.js
import { parsePDF } from "../services/pdfParser.js";
import { chunkText } from "../services/chunker.js";
import { generateEmbedding } from "../services/embedding.service.js";
import { storeChunks } from "../services/vectorStore.service.js";

export async function ingestDocument(req, res) {
  try {
    const text = await parsePDF(req.file.path);
    const chunks = chunkText(text);

    const embeddings = [];
    for (const chunk of chunks) {
      embeddings.push(await generateEmbedding(chunk));
    }

    await storeChunks(chunks, embeddings, req.file.originalname);

    res.json({
      message: "Document ingested successfully",
      chunks: chunks.length,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
