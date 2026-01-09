import fetch from "node-fetch";

export async function generateEmbedding(text) {
  const response = await fetch("https://openrouter.ai/api/v1/embeddings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${"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"}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "http://localhost:3000",
      "X-Title": "RAG-App",
    },
    body: JSON.stringify({
      model: "openai/text-embedding-3-small",
      input: text,
    }),
  });

  const data = await response.json();

  // 🔍 DEBUG LOG (keep for now)
  if (!response.ok) {
    console.error("OpenRouter error:", data);
    throw new Error(data?.error?.message || "Embedding failed");
  }

  return data.data[0].embedding;
}
