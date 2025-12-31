// services/vectorStore.service.js
import DocumentChunk from "../models/DocumentChunk.js";

export async function storeChunks(chunks, embeddings, source) {
  const docs = chunks.map((chunk, i) => ({
    content: chunk,
    embedding: embeddings[i],
    metadata: {
      source,
      chunkIndex: i,
    },
  }));

  await DocumentChunk.insertMany(docs);
}
