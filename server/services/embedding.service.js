// services/embedding.service.js
import { openai } from "../config/openai.js";

export async function generateEmbedding(text) {
  const response = await openai.embeddings.create({
    model: "text-embedding-004",
    input: text,
  });

  return response.data[0].embedding;
}
