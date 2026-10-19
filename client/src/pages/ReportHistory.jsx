import { useEffect, useState } from "react";
import { HiOutlineDocumentText, HiOutlineChevronDown, HiOutlineChevronUp } from "react-icons/hi2";

import Sidebar from "../components/Sidebar";
import Loader from "../components/Loader";
import Reveal from "../components/Reveal";

import { getUserReports } from "../services/reportService";

function ReportHistory() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const data = await getUserReports(userInfo._id);
        setReports(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const recentReports = reports;
  const [expandedIds, setExpandedIds] = useState({});

  const toggleExpanded = (id) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 min-h-screen relative overflow-hidden bg-gradient-to-br from-bg-soft via-white to-teal-light/30 p-8">
        <div
          aria-hidden
          className="absolute -top-28 -left-28 w-96 h-96 rounded-full bg-teal-light blur-3xl animate-blob-pulse pointer-events-none"
        />

        <div className="relative">
          <div className="flex items-center gap-3 mb-1 animate-fade-in-up">
            <span className="w-11 h-11 rounded-xl bg-teal text-white flex items-center justify-center shadow-[0_10px_25px_-8px_rgba(20,184,166,0.45)]">
              <HiOutlineDocumentText className="w-5 h-5" />
            </span>
            <h1 className="font-display text-3xl font-bold text-ink">
              My Reports
            </h1>
          </div>
          <p className="text-body text-sm mb-8 animate-fade-in-up" style={{ animationDelay: "80ms" }}>
            All your uploaded reports and their analysis, most recent first.
          </p>

          {loading ? (
            <Loader label="Loading reports..." />
          ) : (
            <div className="flex flex-col gap-6 max-w-3xl">
              {recentReports.map((report, index) => (
                <Reveal key={report._id} delay={index * 100}>
                  <div className="flex flex-col bg-white/95 backdrop-blur rounded-2xl border border-ink/5 shadow-[0_20px_45px_-25px_rgba(16,24,40,0.25)] hover:shadow-[0_25px_55px_-20px_rgba(20,184,166,0.3)] hover:-translate-y-1 transition-all p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="w-9 h-9 rounded-xl bg-teal-light text-teal flex items-center justify-center shrink-0">
                        <HiOutlineDocumentText className="w-5 h-5" />
                      </span>
                      <h2 className="font-display text-base font-bold text-ink truncate">
                        {report.fileName}
                      </h2>
                    </div>

                    <p className="text-xs font-semibold uppercase tracking-wide text-muted mb-2">
                      Analysis
                    </p>

                    <div
                      className={`bg-bg-soft border border-ink/5 rounded-xl p-4 whitespace-pre-wrap text-sm text-body leading-relaxed flex-1 ${
                        expandedIds[report._id] ? "" : "line-clamp-[10]"
                      }`}
                    >
                      {report.analysis}
                    </div>

                    <button
                      onClick={() => toggleExpanded(report._id)}
                      className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-teal hover:opacity-75 transition self-start"
                    >
                      {expandedIds[report._id] ? (
                        <>
                          Show less
                          <HiOutlineChevronUp className="w-3.5 h-3.5" />
                        </>
                      ) : (
                        <>
                          See full report
                          <HiOutlineChevronDown className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>

                    <p className="mt-3 text-xs text-muted">
                      Uploaded {new Date(report.createdAt).toLocaleString()}
                    </p>
                  </div>
                </Reveal>
              ))}

              {recentReports.length === 0 && (
                <div className="bg-white rounded-2xl border border-ink/5 p-14 text-center shadow-sm animate-fade-in-up">
                  <span className="w-14 h-14 rounded-2xl bg-teal-light text-teal flex items-center justify-center mx-auto mb-4">
                    <HiOutlineDocumentText className="w-7 h-7" />
                  </span>
                  <p className="font-display font-semibold text-lg text-ink">No reports found</p>
                  <p className="text-sm text-muted mt-1">
                    Upload a medical report to see its analysis here.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReportHistory;
