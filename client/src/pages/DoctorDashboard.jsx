import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  HiOutlineUserGroup,
  HiOutlineCalendarDays,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineArrowRight,
} from "react-icons/hi2";

import Sidebar from "../components/Sidebar";
import StatCard from "../components/Statcard";
import Loader from "../components/Loader";
import Reveal from "../components/Reveal";

import {
  getDoctorAppointments,
  updateAppointmentStatus,
} from "../services/appointmentService";

const statusStyles = {
  Booked: "bg-amber text-white",
  Confirmed: "bg-brand text-white",
  Completed: "bg-teal text-white",
  Cancelled: "bg-coral text-white",
};

// "09:00 AM" -> 540 (minutes since midnight)
function timeToMinutes(timeStr) {
  const match = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec((timeStr || "").trim());
  if (!match) return 0;

  let [, hours, minutes, period] = match;
  hours = parseInt(hours, 10) % 12;
  if (period.toUpperCase() === "PM") hours += 12;

  return hours * 60 + parseInt(minutes, 10);
}

function hasAppointmentTimePassed(appointment) {
  const date = new Date(appointment.appointmentDate);
  date.setHours(0, 0, 0, 0);
  date.setMinutes(timeToMinutes(appointment.appointmentTime));
  return date <= new Date();
}

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function DoctorDashboard() {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      const data = await getDoctorAppointments(userInfo.email);
      // A patient-cancelled appointment shouldn't be shown to the doctor,
      // and there's nothing left for the doctor to do with it.
      setAppointments(data.filter((appt) => appt.status !== "Cancelled"));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleStatusUpdate = async (appointmentId, status) => {
    try {
      await updateAppointmentStatus(appointmentId, status);
      fetchAppointments();
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Failed to update status");
    }
  };

  const patientCount = new Set(
    appointments.map((appointment) => appointment.patientName)
  ).size;

  const pendingCount = appointments.filter(
    (appointment) =>
      appointment.status === "Booked" || appointment.status === "Confirmed"
  ).length;

  const completedCount = appointments.filter(
    (appointment) => appointment.status === "Completed"
  ).length;

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

        <div className="relative">
          {/* Hero banner with doctor profile */}
          <div className="relative overflow-hidden rounded-3xl bg-brand px-8 py-8 mb-10 animate-fade-in-up flex items-center gap-5">
            <div
              aria-hidden
              className="absolute -right-10 -top-10 w-56 h-56 rounded-full bg-white/10 animate-float-y"
            />
            <div className="relative h-16 w-16 rounded-full bg-white/20 backdrop-blur text-white flex items-center justify-center text-2xl font-display font-bold shrink-0">
              {userInfo?.name?.charAt(0)}
            </div>

            <div className="relative flex-1">
              <p className="text-brand-light/90 font-semibold text-sm mb-1">
                {greeting()}
              </p>
              <h1 className="font-display text-2xl lg:text-3xl font-bold text-white">
                Dr. {userInfo?.name}
              </h1>
              <p className="text-sm text-brand-light/90 capitalize">
                {userInfo?.role} · Manage your patients and appointments
              </p>
            </div>

            <Link
              to="/doctor-patients"
              className="relative inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur text-white font-semibold text-sm px-5 py-3 rounded-xl transition shrink-0"
            >
              <HiOutlineUserGroup className="w-4 h-4" />
              My Patients
              <HiOutlineArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <Reveal delay={0}>
              <StatCard
                title="Patients"
                value={patientCount}
                tone="brand"
                icon={<HiOutlineUserGroup className="w-5 h-5" />}
              />
            </Reveal>
            <Reveal delay={80}>
              <StatCard
                title="Appointments"
                value={appointments.length}
                tone="teal"
                icon={<HiOutlineCalendarDays className="w-5 h-5" />}
              />
            </Reveal>
            <Reveal delay={160}>
              <StatCard
                title="Pending"
                value={pendingCount}
                tone="amber"
                icon={<HiOutlineClock className="w-5 h-5" />}
              />
            </Reveal>
            <Reveal delay={240}>
              <StatCard
                title="Completed"
                value={completedCount}
                tone="coral"
                icon={<HiOutlineCheckCircle className="w-5 h-5" />}
              />
            </Reveal>
          </div>

        <Reveal>
        <div className="bg-white/95 backdrop-blur rounded-2xl border border-ink/5 shadow-[0_20px_45px_-25px_rgba(16,24,40,0.25)] p-6">
          <h2 className="font-display text-xl font-bold text-ink mb-5">
            My Appointments
          </h2>

          {loading ? (
            <Loader label="Loading appointments..." />
          ) : (
            <>
              {appointments.map((appointment, index) => (
                <div
                  key={appointment._id}
                  className="border border-ink/5 rounded-2xl p-5 mb-4 last:mb-0 hover:shadow-md hover:-translate-y-0.5 hover:border-brand/20 transition-all animate-fade-in-up"
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-display font-bold text-ink text-lg">
                      {appointment.patientName}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 ${
                        statusStyles[appointment.status] ||
                        "bg-muted text-white"
                      }`}
                    >
                      {appointment.status}
                    </span>
                  </div>

                  <div className="mt-3 grid sm:grid-cols-3 gap-2 text-sm text-body">
                    <p>📅 {appointment.appointmentDate}</p>
                    <p>⏰ {appointment.appointmentTime}</p>
                    <p>🏥 {appointment.hospital}</p>
                  </div>

                  <div className="mt-4 flex items-center gap-3">
                    {appointment.status === "Completed" ? (
                      <p className="text-sm text-muted italic">
                        This appointment is completed and can no longer be changed.
                      </p>
                    ) : (
                      <>
                        <label className="text-sm font-semibold text-ink">
                          Update Status
                        </label>

                        <select
                          value={appointment.status}
                          onChange={(e) =>
                            handleStatusUpdate(appointment._id, e.target.value)
                          }
                          className="border border-ink/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"
                        >
                          {appointment.status === "Booked" && (
                            <option value="Booked" disabled>
                              Booked
                            </option>
                          )}
                          <option value="Confirmed">Confirmed</option>
                          <option
                            value="Completed"
                            disabled={!hasAppointmentTimePassed(appointment)}
                          >
                            Completed
                            {!hasAppointmentTimePassed(appointment)
                              ? " (after appointment time)"
                              : ""}
                          </option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </>
                    )}
                  </div>
                </div>
              ))}

              {appointments.length === 0 && (
                <div className="bg-bg-soft rounded-2xl p-10 text-center animate-fade-in-up">
                  <span className="w-12 h-12 rounded-xl bg-brand-light text-brand-dark flex items-center justify-center mx-auto mb-3">
                    <HiOutlineCalendarDays className="w-6 h-6" />
                  </span>
                  <p className="font-medium text-ink">No appointments found</p>
                  <p className="text-sm text-muted mt-1">
                    New patient bookings will show up here.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
        </Reveal>
        </div>
      </div>
    </div>
  );
}

export default DoctorDashboard;
