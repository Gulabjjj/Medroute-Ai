import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  HiOutlineCalendarDays,
  HiOutlineChatBubbleLeftRight,
  HiOutlineDocumentText,
  HiOutlineMapPin,
  HiOutlineArrowRight,
} from "react-icons/hi2";

import Sidebar from "../components/Sidebar";
import Loader from "../components/Loader";
import Reveal from "../components/Reveal";

import { getUserAppointments } from "../services/appointmentService";
import { getUserChats } from "../services/chatHistoryService";
import { getUserReports } from "../services/reportService";

// Free-to-use Unsplash portrait, used purely as a faint decorative
// background watermark on this page.
const DOCTOR_WATERMARK_URL =
  "https://images.unsplash.com/photo-1758691462651-611d730c5272?fm=jpg&q=70&w=1200&auto=format&fit=crop";

// "09:00 AM" -> 540 (minutes since midnight), for sorting same-day appointments.
function timeToMinutes(timeStr) {
  const match = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec((timeStr || "").trim());
  if (!match) return 0;

  let [, hours, minutes, period] = match;
  hours = parseInt(hours, 10) % 12;
  if (period.toUpperCase() === "PM") hours += 12;

  return hours * 60 + parseInt(minutes, 10);
}

// Combines appointmentDate ("YYYY-MM-DD") + appointmentTime ("09:00 AM") into
// an actual Date, so we can tell whether this specific slot has already
// passed — not just whether the calendar day has passed.
function appointmentDateTime(appt) {
  const date = new Date(appt.appointmentDate);
  date.setHours(0, 0, 0, 0);
  date.setMinutes(timeToMinutes(appt.appointmentTime));
  return date;
}

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function Dashboard() {
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [upcomingAppointment, setUpcomingAppointment] = useState(null);
  const [recentChat, setRecentChat] = useState(null);
  const [chatExpanded, setChatExpanded] = useState(false);
  const [recentReport, setRecentReport] = useState(null);
  const [reportExpanded, setReportExpanded] = useState(false);

  useEffect(() => {
    if (userInfo?.role === "doctor") {
      navigate("/doctor-dashboard", { replace: true });
    } else if (userInfo?.role === "admin") {
      navigate("/admin-dashboard", { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!userInfo?._id) {
        setLoading(false);
        return;
      }

      try {
        const [appointments, chats, reports] = await Promise.all([
          getUserAppointments(userInfo._id).catch(() => []),
          getUserChats(userInfo._id).catch(() => []),
          getUserReports(userInfo._id).catch(() => []),
        ]);

        const now = new Date();

        const upcoming = (appointments || [])
          .filter(
            (appt) =>
              appt.status !== "Cancelled" && appointmentDateTime(appt) >= now
          )
          .sort((a, b) => appointmentDateTime(a) - appointmentDateTime(b));

        setUpcomingAppointment(upcoming[0] || null);
        setRecentChat(chats?.[0] || null);
        setRecentReport(reports?.[0] || null);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 min-h-screen relative overflow-hidden bg-gradient-to-br from-bg-soft via-white to-brand-light/30 p-8">
        <div
          aria-hidden
          className="absolute -top-32 -right-24 w-[28rem] h-[28rem] rounded-full bg-brand-light blur-3xl animate-blob-pulse pointer-events-none"
        />
        <div
          aria-hidden
          className="absolute bottom-0 -left-32 w-96 h-96 rounded-full bg-teal-light blur-3xl animate-blob-pulse pointer-events-none"
          style={{ animationDelay: "3s" }}
        />

        {/* Decorative full-page watermark, faded into the background like a
            frosted-glass etching rather than a flat photo cutout. */}
        <img
          src={DOCTOR_WATERMARK_URL}
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover object-top opacity-[0.14] grayscale mix-blend-luminosity blur-[1px] pointer-events-none select-none"
          style={{
            maskImage:
              "linear-gradient(to left, black 0%, black 35%, transparent 85%), linear-gradient(to bottom, transparent 0%, black 20%, black 75%, transparent 100%)",
            maskComposite: "intersect",
            WebkitMaskImage:
              "linear-gradient(to left, black 0%, black 35%, transparent 85%), linear-gradient(to bottom, transparent 0%, black 20%, black 75%, transparent 100%)",
            WebkitMaskComposite: "source-in",
          }}
        />

        <div className="relative">
          {/* Hero welcome banner */}
          <div className="relative overflow-hidden rounded-3xl bg-brand px-8 py-10 mb-10 animate-fade-in-up">
            <div
              aria-hidden
              className="absolute -right-10 -top-10 w-56 h-56 rounded-full bg-white/10 animate-float-y"
            />
            <div
              aria-hidden
              className="absolute right-24 bottom-0 w-24 h-24 rounded-full bg-white/10 animate-float-y"
              style={{ animationDelay: "1.5s" }}
            />
            <p className="text-brand-light/90 font-semibold text-sm mb-1 relative">
              {greeting()}
            </p>
            <h1 className="font-display text-3xl lg:text-4xl font-bold text-white mb-1 relative">
              Welcome{userInfo?.name ? `, ${userInfo.name}` : ""}
            </h1>
            <p className="text-brand-light/90 text-sm relative">
              Here's an overview of your care network.
            </p>
          </div>

          {loading ? (
            <Loader label="Loading dashboard..." />
          ) : (
            <div className="flex flex-col gap-10">
              {/* Upcoming appointment — its own row */}
              <div>
                <h2 className="font-display text-xl font-bold text-ink mb-5">
                  Upcoming Appointment
                </h2>

                <Reveal delay={0}>
                  {upcomingAppointment ? (
                    <div className="bg-white/95 backdrop-blur rounded-2xl border border-ink/5 shadow-[0_20px_45px_-25px_rgba(16,24,40,0.25)] p-6 max-w-xl">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="w-10 h-10 rounded-xl bg-amber-light text-amber flex items-center justify-center shrink-0">
                          <HiOutlineCalendarDays className="w-5 h-5" />
                        </span>
                        <div>
                          <h3 className="font-display font-bold text-ink">
                            {upcomingAppointment.doctor}
                          </h3>
                          <p className="text-xs text-muted flex items-center gap-1">
                            <HiOutlineMapPin className="w-3.5 h-3.5" />
                            {upcomingAppointment.hospital}
                          </p>
                        </div>
                      </div>

                      <p className="text-sm text-body">
                        {new Date(
                          upcomingAppointment.appointmentDate
                        ).toLocaleDateString(undefined, {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}{" "}
                        at {upcomingAppointment.appointmentTime}
                      </p>
                      <p className="text-xs text-muted mt-2">
                        Status: {upcomingAppointment.status}
                      </p>
                    </div>
                  ) : (
                    <div className="bg-white/90 backdrop-blur rounded-2xl border border-ink/5 shadow-sm p-8 max-w-xl text-center">
                      <span className="w-12 h-12 rounded-xl bg-amber-light text-amber flex items-center justify-center mx-auto mb-3">
                        <HiOutlineCalendarDays className="w-6 h-6" />
                      </span>
                      <p className="font-display font-semibold text-ink">
                        No upcoming appointments
                      </p>
                      <p className="text-sm text-muted mt-1">
                        Book one from the Doctors page whenever you're ready.
                      </p>
                    </div>
                  )}
                </Reveal>
              </div>

              {/* Latest chat + latest report — side by side */}
              <div className="grid md:grid-cols-2 gap-6 items-start">
                <div>
                  <h2 className="font-display text-xl font-bold text-ink mb-5">
                    Latest AI Chat
                  </h2>

                  <Reveal delay={80}>
                    {recentChat ? (
                      <div className="bg-white/95 backdrop-blur rounded-2xl border border-ink/5 shadow-[0_20px_45px_-25px_rgba(16,24,40,0.25)] p-6 flex flex-col">
                        <div className="flex items-center gap-3 mb-4">
                          <span className="w-10 h-10 rounded-xl bg-brand-light text-brand-dark flex items-center justify-center shrink-0">
                            <HiOutlineChatBubbleLeftRight className="w-5 h-5" />
                          </span>
                          <h3 className="font-display font-bold text-ink">
                            {recentChat.query}
                          </h3>
                        </div>

                        <p
                          className={`text-sm text-body leading-relaxed ${
                            chatExpanded ? "" : "line-clamp-3"
                          }`}
                        >
                          {recentChat.response}
                        </p>

                        <p className="text-xs text-muted mt-3">
                          {new Date(recentChat.createdAt).toLocaleString()}
                        </p>

                        <button
                          type="button"
                          onClick={() => setChatExpanded((prev) => !prev)}
                          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:text-brand-dark transition self-start"
                        >
                          {chatExpanded ? "See less" : "See more"}
                          <HiOutlineArrowRight
                            className={`w-3.5 h-3.5 transition-transform ${
                              chatExpanded ? "rotate-90" : ""
                            }`}
                          />
                        </button>
                      </div>
                    ) : (
                      <div className="bg-white/90 backdrop-blur rounded-2xl border border-ink/5 shadow-sm p-8 text-center">
                        <span className="w-12 h-12 rounded-xl bg-brand-light text-brand-dark flex items-center justify-center mx-auto mb-3">
                          <HiOutlineChatBubbleLeftRight className="w-6 h-6" />
                        </span>
                        <p className="font-display font-semibold text-ink">
                          No chats yet
                        </p>
                        <p className="text-sm text-muted mt-1">
                          Ask MedRoute AI a health question to get started.
                        </p>
                      </div>
                    )}
                  </Reveal>
                </div>

                <div>
                  <h2 className="font-display text-xl font-bold text-ink mb-5">
                    Latest Report
                  </h2>

                  <Reveal delay={160}>
                    {recentReport ? (
                      <div className="bg-white/95 backdrop-blur rounded-2xl border border-ink/5 shadow-[0_20px_45px_-25px_rgba(16,24,40,0.25)] p-6 flex flex-col">
                        <div className="flex items-center gap-3 mb-4">
                          <span className="w-10 h-10 rounded-xl bg-teal-light text-teal flex items-center justify-center shrink-0">
                            <HiOutlineDocumentText className="w-5 h-5" />
                          </span>
                          <h3 className="font-display font-bold text-ink truncate">
                            {recentReport.fileName}
                          </h3>
                        </div>

                        <p
                          className={`text-sm text-body leading-relaxed whitespace-pre-wrap ${
                            reportExpanded ? "" : "line-clamp-3"
                          }`}
                        >
                          {recentReport.analysis}
                        </p>

                        <p className="text-xs text-muted mt-3">
                          Uploaded {new Date(recentReport.createdAt).toLocaleString()}
                        </p>

                        <button
                          type="button"
                          onClick={() => setReportExpanded((prev) => !prev)}
                          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-teal hover:opacity-75 transition self-start"
                        >
                          {reportExpanded ? "See less" : "See more"}
                          <HiOutlineArrowRight
                            className={`w-3.5 h-3.5 transition-transform ${
                              reportExpanded ? "rotate-90" : ""
                            }`}
                          />
                        </button>
                      </div>
                    ) : (
                      <div className="bg-white/90 backdrop-blur rounded-2xl border border-ink/5 shadow-sm p-8 text-center">
                        <span className="w-12 h-12 rounded-xl bg-teal-light text-teal flex items-center justify-center mx-auto mb-3">
                          <HiOutlineDocumentText className="w-6 h-6" />
                        </span>
                        <p className="font-display font-semibold text-ink">
                          No reports yet
                        </p>
                        <p className="text-sm text-muted mt-1">
                          Upload a medical report to see its analysis here.
                        </p>
                      </div>
                    )}
                  </Reveal>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
