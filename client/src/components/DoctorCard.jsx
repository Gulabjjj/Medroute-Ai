import { useState } from "react";
import { createAppointment } from "../services/appointmentService";
import {
  HiOutlineAcademicCap,
  HiOutlineBuildingOffice2,
  HiOutlineEnvelope,
  HiXMark,
} from "react-icons/hi2";

const TIME_SLOTS = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
];

// "09:00 AM" -> 540 (minutes since midnight)
function timeToMinutes(timeStr) {
  const match = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec((timeStr || "").trim());
  if (!match) return 0;

  let [, hours, minutes, period] = match;
  hours = parseInt(hours, 10) % 12;
  if (period.toUpperCase() === "PM") hours += 12;

  return hours * 60 + parseInt(minutes, 10);
}

function todayStr() {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  return new Date(now.getTime() - offset * 60000).toISOString().slice(0, 10);
}

function DoctorCard({ doctor }) {
  const [showModal, setShowModal] = useState(false);
  const [patientName, setPatientName] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");

  const isToday = appointmentDate === todayStr();
  const nowMinutes = new Date().getHours() * 60 + new Date().getMinutes();

  const availableSlots = TIME_SLOTS.filter(
    (slot) => !isToday || timeToMinutes(slot) > nowMinutes
  );

  const handleDateChange = (e) => {
    setAppointmentDate(e.target.value);
    // Slot may no longer be valid for the newly picked date (e.g. switching
    // from a future date back to today after the slot's time has passed).
    setAppointmentTime("");
  };

  const handleBook = async () => {
    try {
      if (!patientName || !appointmentDate || !appointmentTime) {
        return alert("Please fill all fields");
      }

      if (appointmentDate < todayStr()) {
        return alert("Please choose a date that is today or later");
      }

      if (
        appointmentDate === todayStr() &&
        timeToMinutes(appointmentTime) <= nowMinutes
      ) {
        return alert("Please choose a time slot later than the current time");
      }

      const userInfo = JSON.parse(localStorage.getItem("userInfo"));

      await createAppointment({
        userId: userInfo._id,
        patientName,
        doctor: doctor.name,
        doctorEmail: doctor.email,
        hospital: doctor.hospital,
        appointmentDate,
        appointmentTime,
      });

      alert("Appointment Booked Successfully");

      setShowModal(false);
      setPatientName("");
      setAppointmentDate("");
      setAppointmentTime("");
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Booking Failed");
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-ink/5 shadow-sm p-5 hover:shadow-md hover:-translate-y-1 transition-all">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-brand-light flex items-center justify-center text-brand-dark text-xl font-display font-bold">
            {doctor.name.charAt(0)}
          </div>

          <div>
            <h2 className="text-lg font-display font-bold text-ink">
              {doctor.name}
            </h2>
            <p className="text-sm text-teal font-medium">
              {doctor.specialization}
            </p>
          </div>
        </div>

        <div className="mt-4 space-y-2 text-sm text-body">
          <p className="flex items-center gap-2">
            <HiOutlineAcademicCap className="w-4 h-4 text-muted" />
            {doctor.experience} Years Experience
          </p>

          <p className="flex items-center gap-2">
            <HiOutlineBuildingOffice2 className="w-4 h-4 text-muted" />
            {doctor.hospital}
          </p>

          {doctor.email && (
            <p className="flex items-center gap-2">
              <HiOutlineEnvelope className="w-4 h-4 text-muted" />
              {doctor.email}
            </p>
          )}
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="mt-5 w-full bg-brand text-white font-semibold py-2.5 rounded-xl hover:bg-brand-dark transition"
        >
          Book Appointment
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm flex items-center justify-center z-50 px-4 animate-fade-in">
          <div className="bg-white p-6 rounded-2xl w-full max-w-md relative animate-pop-in">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-muted hover:text-ink"
              aria-label="Close"
            >
              <HiXMark className="w-5 h-5" />
            </button>

            <h2 className="font-display text-xl font-bold text-ink mb-1">
              Book with {doctor.name}
            </h2>
            <p className="text-sm text-muted mb-5">{doctor.specialization}</p>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Patient Name"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full border border-ink/10 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/30"
              />

              <input
                type="date"
                min={todayStr()}
                value={appointmentDate}
                onChange={handleDateChange}
                className="w-full border border-ink/10 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/30"
              />

              <select
                value={appointmentTime}
                onChange={(e) => setAppointmentTime(e.target.value)}
                className="w-full border border-ink/10 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/30"
              >
                <option value="">Select Time Slot</option>
                {availableSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>

              {isToday && availableSlots.length === 0 && (
                <p className="text-xs text-coral -mt-1">
                  No more slots left today — please pick another date.
                </p>
              )}
            </div>

            <div className="flex gap-3 mt-5">
              <button
                onClick={handleBook}
                className="flex-1 bg-brand text-white font-semibold py-2.5 rounded-xl hover:bg-brand-dark transition"
              >
                Confirm
              </button>

              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-bg-soft text-ink font-semibold py-2.5 rounded-xl hover:bg-ink/5 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default DoctorCard;
