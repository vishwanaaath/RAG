import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

/** 🤖 AI avatar */
const AI_PIC =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlqn6wWj2n8WDdqn8Rs94oviQA-c7oTNkEkQ&s";

/** 🔹 Format time */
const formatTime = (date) =>
  new Date(date).toLocaleString([], {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

export default function PdfChatLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth0();

  /** 🔐 DB user */
  const passedUser = location.state?.user;
  const [dbUser, setDbUser] = useState(
    passedUser || JSON.parse(localStorage.getItem("dbUser"))
  );

  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const [chat, setChat] = useState([]);
  const [question, setQuestion] = useState("");
  const [history, setHistory] = useState([]);
  const [activeId, setActiveId] = useState(null);

  const bottomRef = useRef(null);

  /** 🔹 Persist user */
  useEffect(() => {
    if (passedUser) {
      localStorage.setItem("dbUser", JSON.stringify(passedUser));
      setDbUser(passedUser);
    }
  }, [passedUser]);

  /** 🔹 Auto scroll */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  /** 🔹 Fetch user conversations */
  useEffect(() => {
    if (!dbUser?.email) return;

    fetch(
      `http://localhost:5000/api/history?email=${encodeURIComponent(
        dbUser.email
      )}`
    )
      .then((res) => res.json())
      .then(setHistory)
      .catch(console.error);
  }, [dbUser]);

  /** 🆕 New Chat */
  const handleNewChat = () => {
    setChat([]);
    setQuestion("");
    setActiveId(null);
    setMessage("");
  };

  /** 🔹 Load conversation */
  const loadConversation = async (id) => {
    const res = await fetch(
      `http://localhost:5000/api/history/${id}?email=${encodeURIComponent(
        dbUser.email
      )}`
    );
    const data = await res.json();

    setChat([
      { role: "user", content: data.question, time: data.createdAt },
      { role: "assistant", content: data.answer, time: data.createdAt },
    ]);

    setActiveId(id);
  };

  /** 📎 PDF handling */
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected || selected.type !== "application/pdf") {
      setMessage("Please upload a valid PDF file");
      return;
    }
    setFile(selected);
    setMessage("");
  };

  const handleUpload = async () => {
    if (!file) return;

    setStatus("uploading");
    setMessage("");

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("http://localhost:5000/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setStatus("done");
    setMessage(`Indexed ${data.totalChunks} chunks`);
  };

  /** 💬 Ask question */
  const handleAsk = async () => {
    if (!question.trim()) return;

    const now = new Date();
    const userMessage = question;

    setChat((prev) => [
      ...prev,
      { role: "user", content: userMessage, time: now },
      { role: "assistant", content: "Thinking...", time: new Date() },
    ]);

    setQuestion("");

  const res = await fetch("http://localhost:5000/api/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      question: userMessage,
      userEmail: dbUser.email, // ✅ THIS LINE FIXES EVERYTHING
    }),
  });


    const data = await res.json();

    setChat((prev) => {
      const updated = [...prev];
      updated[updated.length - 1] = {
        role: "assistant",
        content: data.answer,
        time: new Date(),
      };
      return updated;
    });

    const historyRes = await fetch(
      `http://localhost:5000/api/history?email=${encodeURIComponent(
        dbUser.email
      )}`
    );
    setHistory(await historyRes.json());
  };

  /** 🚪 Logout */
  const handleLogout = () => {
    localStorage.removeItem("dbUser");
    logout({
      logoutParams: { returnTo: window.location.origin },
    });
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-[#0f0f0f] text-white">
      {/* 🧠 Sidebar */}
      <aside className="w-60 border-r border-white/10 p-4 flex flex-col">
        <div className="flex-1 overflow-y-auto">
          <h2 className="mb-3 text-sm font-semibold text-neutral-400">
            Conversations
          </h2>

          <button
            onClick={handleNewChat}
            className="mb-4 w-full rounded-md border border-white/10 px-3 py-2 text-sm hover:bg-white/10">
            + New Chat
          </button>

          <div className="space-y-1">
            {history.map((item) => (
              <button
                key={item._id}
                onClick={() => loadConversation(item._id)}
                className={`w-full rounded-md px-3 py-2 text-left text-sm ${
                  activeId === item._id ? "bg-white/15" : "hover:bg-white/10"
                }`}>
                <span className="block truncate">{item.question}</span>
                <span className="block text-xs text-neutral-500">
                  {formatTime(item.createdAt)}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 👤 Profile */}
        {dbUser && (
          <button
            onClick={handleLogout}
            className="mt-4 border-t border-white/10 pt-4 flex items-center gap-3 rounded-md p-2 hover:bg-white/5">
            <img
              src={dbUser.picture}
              alt={dbUser.name}
              width={36}
              height={36}
              className="rounded-full flex-none object-cover"
            />

            <div className="min-w-0 text-left">
              <p className="text-sm font-medium truncate">{dbUser.name}</p>
              <p className="text-xs text-neutral-400 truncate">
                {dbUser.email}
              </p>
              <p className="text-xs text-red-400 mt-1">Log out</p>
            </div>
          </button>
        )}
      </aside>

      {/* 🧩 Main Chat */}
      <div className="flex flex-1 flex-col">
        <header className="border-b border-white/10 px-6 py-4">
          <h1 className="text-lg font-semibold">Ops Mind</h1>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-3xl px-4 py-6 space-y-6">
            {chat.map((msg, i) => (
              <div key={i} className="flex gap-3">
                <img
                  src={msg.role === "user" ? dbUser.picture : AI_PIC}
                  className="h-8 w-8 rounded-full mt-1 shrink-0"
                />

                <div className="flex-1">
                  <div className="text-xs uppercase text-neutral-500">
                    {msg.role === "user" ? "You" : "Ops Mind"}
                  </div>
                  <div className="rounded-lg bg-white/10 px-4 py-3 text-sm">
                    {msg.content}
                  </div>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        </main>

        {/* 🔽 Bottom Bar */}
        <footer className="border-t border-white/10 px-4 py-4 space-y-3">
          {/* 📎 PDF Upload */}
          <div className="mx-auto max-w-3xl flex gap-3 bg-white/5 px-4 py-3 rounded-lg">
            <label className="cursor-pointer text-sm">
              Upload PDF
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            <span className="flex-1 truncate text-sm text-neutral-400">
              {file ? file.name : "No file selected"}
            </span>

            <button
              onClick={handleUpload}
              disabled={!file || status === "uploading"}
              className="bg-white/10 px-4 py-1.5 rounded-md text-sm hover:bg-white/20">
              {status === "uploading" ? "Processing…" : "Upload"}
            </button>
          </div>

          {/* 💬 Input */}
          <div className="mx-auto max-w-3xl flex gap-2">
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAsk()}
              placeholder="Ask Ops Mind…"
              className="flex-1 rounded-md bg-white/5 px-4 py-3 text-sm outline-none"
            />
            <button
              onClick={handleAsk}
              className="rounded-md bg-white/10 px-4 hover:bg-white/20">
              Send
            </button>
          </div>

          {message && (
            <p className="text-center text-xs text-neutral-400">{message}</p>
          )}
        </footer>
      </div>
    </div>
  );
}
