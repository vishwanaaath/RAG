import { useState } from "react";

export default function PdfChatLayout() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected || selected.type !== "application/pdf") {
      setMessage("Please upload a valid PDF file");
      return;
    }
    setFile(selected);
    setMessage("");
  };

  return (
    <div className="flex h-screen bg-[#0f0f0f] text-white">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-white/10 bg-[#0b0b0b] p-4">
        <h2 className="text-lg font-semibold mb-4">Knowledge Base</h2>

        <button className="mb-3 rounded-lg bg-white/10 px-4 py-2 text-sm hover:bg-white/20">
          + New Session
        </button>

        <div className="text-xs text-neutral-400 mt-4 space-y-2">
          <p>📄 Uploaded PDFs</p>
          <p className="opacity-60">No documents yet</p>
        </div>
      </aside>

      {/* Main Area */}
      <main className="flex flex-1 flex-col">
        {/* Header */}
        <header className="border-b border-white/10 px-6 py-4">
          <h1 className="text-lg font-semibold">PDF Knowledge Assistant</h1>
          <p className="text-xs text-neutral-400">
            Upload documents and chat with them
          </p>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="max-w-xl text-sm text-neutral-400">
            Upload a PDF to begin indexing its content.
          </div>
        </div>

        {/* Input / Upload Bar */}
        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3">
            <label className="cursor-pointer text-sm text-neutral-300 hover:text-white">
              📎 Upload PDF
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            <div className="flex-1 text-sm text-neutral-400 truncate">
              {file ? file.name : "Attach a PDF to begin"}
            </div>

            <button
              disabled={!file || status === "uploading"}
              className="rounded-md bg-indigo-500 px-4 py-1.5 text-sm font-medium transition hover:bg-indigo-600 disabled:opacity-50">
              {status === "uploading" ? "Processing..." : "Upload"}
            </button>
          </div>

          {message && (
            <p className="mt-2 text-xs text-center text-red-400">{message}</p>
          )}
        </div>
      </main>
    </div>
  );
}
