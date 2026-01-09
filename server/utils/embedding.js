export async function getEmbedding(text) {
  const res = await fetch("http://127.0.0.1:11434/api/embeddings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "nomic-embed-text",
      prompt: text,
    }),
  });

  const data = await res.json();

  if (!data.embedding) {
    throw new Error("Embedding generation failed");
  }

  return data.embedding; // 768-dim vector
}
