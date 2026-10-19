import { useEffect, useState } from "react";
import { HiOutlineClock } from "react-icons/hi2";

import Sidebar from "../components/Sidebar";
import Loader from "../components/Loader";
import Reveal from "../components/Reveal";

import { getUserChats } from "../services/chatHistoryService";

function ChatHistory() {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const data = await getUserChats(userInfo._id);
        setChats(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  const recentChats = chats;

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 min-h-screen relative overflow-hidden bg-gradient-to-br from-bg-soft via-white to-brand-light/30 p-8">
        <div
          aria-hidden
          className="absolute -top-28 -right-28 w-96 h-96 rounded-full bg-brand-light blur-3xl animate-blob-pulse pointer-events-none"
        />

        <div className="relative">
          <div className="flex items-center gap-3 mb-1 animate-fade-in-up">
            <span className="w-11 h-11 rounded-xl bg-brand text-white flex items-center justify-center shadow-[0_10px_25px_-8px_rgba(36,81,224,0.5)]">
              <HiOutlineClock className="w-5 h-5" />
            </span>
            <h1 className="font-display text-3xl font-bold text-ink">
              My Chat History
            </h1>
          </div>
          <p className="text-body text-sm mb-8 animate-fade-in-up" style={{ animationDelay: "80ms" }}>
            All your questions to MedRoute AI, most recent first.
          </p>

          {loading ? (
            <Loader label="Loading chat history..." />
          ) : recentChats.length === 0 ? (
            <div className="bg-white rounded-2xl border border-ink/5 p-14 text-center shadow-sm animate-fade-in-up">
              <span className="w-14 h-14 rounded-2xl bg-brand-light text-brand-dark flex items-center justify-center mx-auto mb-4">
                <HiOutlineClock className="w-7 h-7" />
              </span>
              <p className="font-display font-semibold text-lg text-ink">No chat history found</p>
              <p className="text-sm text-muted mt-1">
                Ask MedRoute AI a question to see it here.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-6 max-w-3xl">
              {recentChats.map((chat, index) => (
                <Reveal key={chat._id} delay={index * 100}>
                  <div className="flex flex-col bg-white/95 backdrop-blur rounded-2xl border border-ink/5 shadow-[0_20px_45px_-25px_rgba(16,24,40,0.25)] hover:shadow-[0_25px_55px_-20px_rgba(36,81,224,0.3)] hover:-translate-y-1 transition-all p-6">
                    <div className="mb-4">
                      <span className="text-xs font-semibold uppercase tracking-wide text-brand-dark bg-brand-light px-3 py-1 rounded-full">
                        Question
                      </span>
                    </div>

                    <p className="text-ink text-sm font-medium mb-5">{chat.query}</p>

                    <div className="mt-auto pt-4 border-t border-ink/5">
                      <h3 className="text-xs font-semibold uppercase tracking-wide text-teal mb-1.5">
                        AI Response
                      </h3>
                      <p className="whitespace-pre-wrap text-sm text-body leading-relaxed">
                        {chat.response}
                      </p>
                    </div>

                    <div className="mt-4 text-xs text-muted">
                      {new Date(chat.createdAt).toLocaleString()}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatHistory;
