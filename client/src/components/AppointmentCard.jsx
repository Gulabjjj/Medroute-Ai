import {
  HiOutlineUserGroup,
  HiOutlineBuildingOffice2,
  HiOutlineCalendarDays,
  HiOutlineClock,
} from "react-icons/hi2";

const statusStyles = {
  Booked: "bg-amber-light text-amber",
  Confirmed: "bg-brand-light text-brand-dark",
  Completed: "bg-teal-light text-teal",
  Cancelled: "bg-coral-light text-coral",
};

function AppointmentCard({
  patientName,
  doctor,
  hospital,
  date,
  time,
  status,
  onCancel,
}) {
  return (
    <div className="bg-white rounded-2xl border border-ink/5 shadow-sm p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-bold text-ink">
            {patientName || doctor}
          </h2>
          {patientName && (
            <p className="text-sm text-teal font-medium mt-0.5">{doctor}</p>
          )}
        </div>

        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 ${
            statusStyles[status] || "bg-bg-soft text-body"
          }`}
        >
          {status}
        </span>
      </div>

      <div className="mt-4 grid sm:grid-cols-2 gap-2 text-sm text-body">
        <p className="flex items-center gap-2">
          <HiOutlineBuildingOffice2 className="w-4 h-4 text-muted" />
          {hospital}
        </p>
        <p className="flex items-center gap-2">
          <HiOutlineCalendarDays className="w-4 h-4 text-muted" />
          {date}
        </p>
        {time && (
          <p className="flex items-center gap-2">
            <HiOutlineClock className="w-4 h-4 text-muted" />
            {time}
          </p>
        )}
      </div>

      {status === "Booked" && onCancel && (
        <button
          onClick={onCancel}
          className="mt-4 bg-coral-light text-coral font-semibold px-4 py-2 rounded-xl hover:bg-coral hover:text-white transition text-sm"
        >
          Cancel Appointment
        </button>
      )}
    </div>
  );
}

export default AppointmentCard;
