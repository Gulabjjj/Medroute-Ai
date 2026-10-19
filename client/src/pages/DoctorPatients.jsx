import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  HiOutlineUserGroup,
  HiOutlineCalendarDays,
  HiOutlineClock,
  HiOutlineArrowLeft,
} from "react-icons/hi2";

import Sidebar from "../components/Sidebar";
import Loader from "../components/Loader";
import Reveal from "../components/Reveal";

import { getDoctorAppointments } from "../services/appointmentService";

const statusStyles = {
  Booked: "bg-amber text-white",
  Confirmed: "bg-brand text-white",
  Completed: "bg-teal text-white",
  Cancelled: "bg-coral text-white",
};

function DoctorPatients() {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await getDoctorAppointments(userInfo.email);
        // Cancelled appointments shouldn't clutter the doctor's patient view.
        setAppointments(data.filter((appt) => appt.status !== "Cancelled"));
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Group this doctor's appointments by patient name — a doctor should
  // only ever see the patients who have booked with them.
  const patients = Object.values(
    appointments.reduce((acc, appointment) => {
      const key = appointment.patientName;

      if (!acc[key]) {
        acc[key] = {
          patientName: appointment.patientName,
          visits: [],
        };
      }

      acc[key].visits.push(appointment);
      return acc;
    }, {})
  )
    .map((patient) => ({
      ...patient,
      visits: patient.visits.sort(
        (a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate)
      ),
    }))
    .sort(
      (a, b) =>
        new Date(b.visits[0].appointmentDate) -
        new Date(a.visits[0].appointmentDate)
    );

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 min-h-screen relative overflow-hidden bg-gradient-to-br from-bg-soft via-white to-brand-light/30 p-8">
        <div
          aria-hidden
          className="absolute -top-32 -right-24 w-[28rem] h-[28rem] rounded-full bg-brand-light blur-3xl animate-blob-pulse pointer-events-none"
        />

        <div className="relative">
          <Link
            to="/doctor-dashboard"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-body hover:text-ink transition mb-4 animate-fade-in-up"
          >
            <HiOutlineArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          <div className="flex items-center gap-3 mb-1 animate-fade-in-up">
            <span className="w-11 h-11 rounded-xl bg-brand text-white flex items-center justify-center shadow-[0_10px_25px_-8px_rgba(36,81,224,0.5)]">
              <HiOutlineUserGroup className="w-5 h-5" />
            </span>
            <h1 className="font-display text-3xl font-bold text-ink">
              My Patients
            </h1>
          </div>
          <p className="text-body text-sm mb-8 animate-fade-in-up" style={{ animationDelay: "80ms" }}>
            Only patients who have booked an appointment with you, Dr. {userInfo?.name}.
          </p>

          {loading ? (
            <Loader label="Loading your patients..." />
          ) : patients.length === 0 ? (
            <div className="bg-white rounded-2xl border border-ink/5 p-14 text-center shadow-sm animate-fade-in-up">
              <span className="w-14 h-14 rounded-2xl bg-brand-light text-brand-dark flex items-center justify-center mx-auto mb-4">
                <HiOutlineUserGroup className="w-7 h-7" />
              </span>
              <p className="font-display font-semibold text-lg text-ink">
                No patients yet
              </p>
              <p className="text-sm text-muted mt-1">
                Once a patient books an appointment with you, they'll show up here.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-2">
              {patients.map((patient, index) => {
                return (
                  <Reveal key={patient.patientName} delay={index * 80}>
                    <div className="h-full bg-white/95 backdrop-blur rounded-2xl border border-ink/5 shadow-[0_20px_45px_-25px_rgba(16,24,40,0.25)] hover:shadow-[0_25px_55px_-20px_rgba(36,81,224,0.3)] hover:-translate-y-1 transition-all p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="w-11 h-11 rounded-full bg-brand-light text-brand-dark font-display font-bold flex items-center justify-center">
                          {patient.patientName?.charAt(0).toUpperCase()}
                        </span>
                        <div>
                          <h2 className="font-display font-bold text-ink">
                            {patient.patientName}
                          </h2>
                          <p className="text-xs text-muted">
                            {patient.visits.length} visit
                            {patient.visits.length > 1 ? "s" : ""} with you
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {patient.visits.slice(0, 3).map((visit) => (
                          <div
                            key={visit._id}
                            className="bg-bg-soft rounded-xl px-4 py-3 flex items-center justify-between gap-3 text-sm"
                          >
                            <div className="flex items-center gap-2 text-body">
                              <HiOutlineCalendarDays className="w-4 h-4 text-brand shrink-0" />
                              {visit.appointmentDate}
                              <HiOutlineClock className="w-4 h-4 text-brand shrink-0 ml-2" />
                              {visit.appointmentTime}
                            </div>
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold shrink-0 ${
                                statusStyles[visit.status] || "bg-muted text-white"
                              }`}
                            >
                              {visit.status}
                            </span>
                          </div>
                        ))}

                        {patient.visits.length > 3 && (
                          <p className="text-xs text-muted pt-1">
                            +{patient.visits.length - 3} more visit
                            {patient.visits.length - 3 > 1 ? "s" : ""}
                          </p>
                        )}
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DoctorPatients;
