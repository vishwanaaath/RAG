async function test() {
  const res = await fetch("http://127.0.0.1:11434/api/embeddings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "nomic-embed-text",
      prompt: "Hello world",
    }),
  });

  const text = await res.text();
  console.log("Raw response:", text);

  const data = JSON.parse(text);
  console.log("Embedding length:", data.embedding.length);
}

test();
