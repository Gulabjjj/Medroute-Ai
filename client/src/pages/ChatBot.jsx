import { useState } from "react";
import axios from "axios";
import { HiOutlineChatBubbleLeftRight, HiOutlineSparkles } from "react-icons/hi2";

import Sidebar from "../components/Sidebar";
import Reveal from "../components/Reveal";
import api from "../services/api";

const FASTAPI_URL = import.meta.env.VITE_AI_URL || "http://127.0.0.1:8000";

function ChatBot() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [route, setRoute] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) {
      alert("Please enter a message");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(`${FASTAPI_URL}/chat`, {
        message,
      });

      const aiResponse = res.data.response;
      const aiRoute = res.data.route;

      setRoute(aiRoute);
      setResponse(aiResponse);

      // Don't clutter chat history with off-topic questions that never
      // got a real medical answer.
      if (aiRoute !== "non_medical") {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));

        await api.post("/chat-history", {
          userId: userInfo._id,
          query: message,
          response: aiResponse,
          route: aiRoute,
        });
      }
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.detail || "Failed to get AI response");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 min-h-screen relative overflow-hidden bg-gradient-to-br from-bg-soft via-white to-brand-light/40 p-8">
        <div
          aria-hidden
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-brand-light blur-3xl animate-blob-pulse pointer-events-none"
        />
        <div
          aria-hidden
          className="absolute bottom-0 -left-24 w-80 h-80 rounded-full bg-teal-light blur-3xl animate-blob-pulse pointer-events-none"
          style={{ animationDelay: "3s" }}
        />

        <div className="max-w-3xl mx-auto relative">
          <div className="flex items-center gap-3 mb-1 animate-fade-in-up">
            <span className="w-11 h-11 rounded-xl bg-brand text-white flex items-center justify-center shadow-[0_10px_25px_-8px_rgba(36,81,224,0.5)]">
              <HiOutlineChatBubbleLeftRight className="w-5 h-5" />
            </span>
            <h1 className="font-display text-3xl font-bold text-ink">
              AI Chat
            </h1>
          </div>
          <p className="text-body text-sm mb-8 animate-fade-in-up" style={{ animationDelay: "80ms" }}>
            Describe your symptoms and get routed to the right kind of care.
          </p>

          <div className="bg-white/90 backdrop-blur rounded-2xl border border-ink/5 shadow-[0_20px_45px_-25px_rgba(16,24,40,0.25)] p-6 animate-fade-in-up" style={{ animationDelay: "140ms" }}>
            <textarea
              className="w-full border border-ink/10 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"
              rows="5"
              placeholder="Describe your symptoms..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            <button
              onClick={handleSend}
              disabled={loading}
              className="mt-4 inline-flex items-center gap-2 bg-brand text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-brand-dark disabled:bg-muted transition"
            >
              <HiOutlineSparkles className="w-4 h-4" />
              {loading ? "Thinking..." : "Ask AI"}
            </button>
          </div>

          {response && (
            <Reveal className="mt-5 p-6 rounded-2xl bg-white/95 backdrop-blur border border-ink/5 shadow-[0_20px_45px_-25px_rgba(16,24,40,0.25)]">
              <h2 className="font-display font-bold text-lg text-ink mb-3 flex items-center gap-2">
                <HiOutlineSparkles className="w-4 h-4 text-brand" />
                AI Response
              </h2>
              <div className="whitespace-pre-wrap text-sm text-body leading-relaxed">
                {response}
              </div>
            </Reveal>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatBot;
