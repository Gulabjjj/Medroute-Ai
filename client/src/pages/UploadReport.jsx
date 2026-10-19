import { useState } from "react";
import {
  HiOutlineDocumentArrowUp,
  HiOutlineChatBubbleLeftRight,
  HiOutlinePaperAirplane,
} from "react-icons/hi2";

import Sidebar from "../components/Sidebar";
import Loader from "../components/Loader";
import {
  analyzeReport,
  askReport,
  createReport,
} from "../services/reportService";

function UploadReport() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [isReport, setIsReport] = useState(false);

  const [question, setQuestion] = useState("");
  const [qaHistory, setQaHistory] = useState([]);
  const [asking, setAsking] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a PDF report");
      return;
    }

    try {
      setLoading(true);
      setResult("");
      setQaHistory([]);
      setFileName(null);
      setIsReport(false);

      const formData = new FormData();
      formData.append("file", file);

      const data = await analyzeReport(formData);

      setResult(data.analysis);
      setFileName(data.fileName);
      setIsReport(Boolean(data.isReport));

      // Only save to history and unlock the Q&A box when this was actually
      // a medical report — not for random PDFs the analyzer rejected.
      if (data.isReport) {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));

        await createReport({
          userId: userInfo._id,
          fileName: file.name,
          analysis: data.analysis,
        });
      }
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.detail || "Report analysis failed");
    } finally {
      setLoading(false);
    }
  };

  const handleAsk = async () => {
    if (!question.trim()) return;

    if (!fileName) {
      alert("Please upload and analyze a report first");
      return;
    }

    const currentQuestion = question;
    setQuestion("");

    try {
      setAsking(true);

      const data = await askReport(fileName, currentQuestion);

      setQaHistory((prev) => [
        ...prev,
        { question: currentQuestion, answer: data.answer },
      ]);
    } catch (error) {
      console.log(error);

      setQaHistory((prev) => [
        ...prev,
        {
          question: currentQuestion,
          answer:
            "Something went wrong while answering your question. Please try again.",
        },
      ]);
    } finally {
      setAsking(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 bg-bg-soft min-h-screen p-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-1">
            <span className="w-9 h-9 rounded-xl bg-brand-light text-brand-dark flex items-center justify-center">
              <HiOutlineDocumentArrowUp className="w-5 h-5" />
            </span>
            <h1 className="font-display text-3xl font-bold text-ink">
              Medical Report Analysis
            </h1>
          </div>
          <p className="text-body text-sm mb-8">
            Upload a report to get a plain-language summary, then ask
            anything about it.
          </p>

          <div className="bg-white rounded-2xl border border-ink/5 shadow-sm p-6">
            <label className="block border-2 border-dashed border-ink/10 rounded-2xl p-8 text-center cursor-pointer hover:border-brand/40 transition">
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setFile(e.target.files[0])}
                className="hidden"
              />
              <HiOutlineDocumentArrowUp className="w-8 h-8 text-muted mx-auto mb-2" />
              <p className="text-sm font-medium text-ink">
                {file ? file.name : "Click to choose a PDF report"}
              </p>
              <p className="text-xs text-muted mt-1">PDF files only</p>
            </label>

            <button
              onClick={handleUpload}
              disabled={loading}
              className="mt-5 w-full bg-brand text-white font-semibold py-3 rounded-xl hover:bg-brand-dark disabled:bg-muted transition"
            >
              {loading ? "Analyzing Report..." : "Analyze Report"}
            </button>

            {loading && <Loader label="AI is reading your report..." />}

            {result && (
              <div className="mt-6 rounded-2xl border border-ink/5 bg-bg-soft p-5">
                <h2 className="font-display text-lg font-bold text-ink mb-3">
                  Analysis Result
                </h2>
                <div className="whitespace-pre-wrap text-sm text-body leading-relaxed">
                  {result}
                </div>
              </div>
            )}
          </div>

          {fileName && isReport && (
            <div className="mt-6 bg-white rounded-2xl border border-ink/5 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <HiOutlineChatBubbleLeftRight className="w-5 h-5 text-teal" />
                <h2 className="font-display text-lg font-bold text-ink">
                  Ask a question about this report
                </h2>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="e.g. What is my hemoglobin level?"
                  className="flex-1 border border-ink/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"
                />

                <button
                  onClick={handleAsk}
                  disabled={asking}
                  className="inline-flex items-center gap-1.5 bg-brand text-white font-semibold px-5 py-3 rounded-xl hover:bg-brand-dark disabled:bg-muted transition"
                >
                  <HiOutlinePaperAirplane className="w-4 h-4" />
                  {asking ? "Asking..." : "Ask"}
                </button>
              </div>

              {qaHistory.length > 0 && (
                <div className="mt-5 space-y-4">
                  {qaHistory.map((qa, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl border border-ink/5 bg-bg-soft p-4"
                    >
                      <div className="font-semibold text-ink text-sm">
                        Q: {qa.question}
                      </div>
                      <div className="mt-2 whitespace-pre-wrap text-sm text-body leading-relaxed">
                        {qa.answer}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UploadReport;
