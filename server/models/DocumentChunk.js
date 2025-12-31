// models/DocumentChunk.js
import mongoose from "mongoose";

const DocumentChunkSchema = new mongoose.Schema({
  content: String,
  embedding: {
    type: [Number],
    index: "vectorSearch",
  },
  metadata: {
    source: String,
    chunkIndex: Number,
  },
});

export default mongoose.model("DocumentChunk", DocumentChunkSchema);
