import { useEffect, useState } from "react";
import { HiOutlineCalendarDays } from "react-icons/hi2";

import Sidebar from "../components/Sidebar";
import AppointmentCard from "../components/AppointmentCard";
import Loader from "../components/Loader";

import {
  getUserAppointments,
  cancelAppointment,
} from "../services/appointmentService";

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const data = await getUserAppointments(userInfo._id);
      setAppointments(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCancel = async (id) => {
    try {
      await cancelAppointment(id);
      fetchAppointments();
      alert("Appointment Cancelled");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 min-h-screen relative overflow-hidden bg-gradient-to-br from-bg-soft via-white to-amber-light/40 p-8">
        <div
          aria-hidden
          className="absolute -top-32 -right-24 w-[28rem] h-[28rem] rounded-full bg-amber-light blur-3xl animate-blob-pulse pointer-events-none"
        />
        <div
          aria-hidden
          className="absolute bottom-0 -left-32 w-96 h-96 rounded-full bg-brand-light blur-3xl animate-blob-pulse pointer-events-none"
          style={{ animationDelay: "3s" }}
        />

        <div className="relative">
        <div className="flex items-center gap-3 mb-1">
          <span className="w-9 h-9 rounded-xl bg-amber-light text-amber flex items-center justify-center">
            <HiOutlineCalendarDays className="w-5 h-5" />
          </span>
          <h1 className="font-display text-3xl font-bold text-ink">
            My Appointments
          </h1>
        </div>
        <p className="text-body text-sm mb-8">
          Track and manage your upcoming visits.
        </p>

        {loading ? (
          <Loader label="Loading appointments..." />
        ) : (
          <div className="grid gap-5">
            {appointments.map((appointment) => (
              <AppointmentCard
                key={appointment._id}
                patientName={appointment.patientName}
                doctor={appointment.doctor}
                hospital={appointment.hospital}
                date={appointment.appointmentDate}
                time={appointment.appointmentTime}
                status={appointment.status}
                onCancel={() => handleCancel(appointment._id)}
              />
            ))}

            {appointments.length === 0 && (
              <div className="bg-white rounded-2xl border border-ink/5 p-10 text-center">
                <HiOutlineCalendarDays className="w-8 h-8 text-muted mx-auto mb-3" />
                <p className="font-medium text-ink">No appointments found</p>
                <p className="text-sm text-muted mt-1">
                  Book a doctor to see your appointments here.
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

export default Appointments;
