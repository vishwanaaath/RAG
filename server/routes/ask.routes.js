import express from "express";
import { Conversation } from "../models/Conversation.js";
import { Chunk } from "../models/Chunk.js";
import { getEmbedding } from "../utils/embedding.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { question, userEmail } = req.body;

    // ✅ Validate input
    if (!question || !question.trim()) {
      return res.status(400).json({ error: "Question is required" });
    }

    if (!userEmail) {
      return res.status(400).json({ error: "User email is required" });
    }

    // 1️⃣ Embed question
    const queryEmbedding = await getEmbedding(question);

    // 2️⃣ Vector search
    const results = await Chunk.aggregate([
      {
        $vectorSearch: {
          index: "vector_index",
          path: "embedding",
          queryVector: queryEmbedding,
          numCandidates: 100,
          limit: 5,
        },
      },
      {
        $project: {
          _id: 0,
          text: 1,
          source: 1,
          chunkIndex: 1,
        },
      },
    ]);

    // 3️⃣ Extract sources
    const sources = [...new Set(results.map((r) => r.source))].join(", ");

    // 4️⃣ Build context
    const context = results
      .map(
        (r) => `
[FILE: ${r.source}]
[CHUNK: ${r.chunkIndex}]
${r.text}
`
      )
      .join("\n\n");

    // 5️⃣ Prompt
    const prompt = `
You are Ops Mind, a strict document-based assistant.

IMPORTANT FACT:
The following PDF file(s) ARE PROVIDED and MUST be cited:
${sources}

STRICT RULES:
- Use only the provided context.
- Always include the PDF file name exactly as given.
- Never say the file name is missing or use uncertainty language.
- Cite the section name if visible; otherwise cite the chunk number.
- Do not say "I don't know" if the answer is present.

OUTPUT FORMAT (MANDATORY):

Answer:
<clear answer>

References:
Source:
- File: <PDF file name>
  Location: <Section name OR Chunk number>

Context:
${context}

Question:
${question}
`;

    const response = await fetch("http://127.0.0.1:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3",
        stream: false,
        temperature: 0,
        prompt,
      }),
    });

    const data = await response.json();
    const finalAnswer = data.response || "I don't know.";

    // ✅ Save conversation WITH user email
    await Conversation.create({
      userEmail,
      question,
      answer: finalAnswer,
    });

    res.json({ answer: finalAnswer });
  } catch (err) {
    console.error("❌ Ask route error:", err);
    res.status(500).json({ error: "Failed to answer question" });
  }
});

export default router;
