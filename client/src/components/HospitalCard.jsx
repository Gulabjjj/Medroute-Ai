import { useState } from "react";
import { HiOutlineMapPin, HiOutlineXMark, HiOutlineBuildingOffice2 } from "react-icons/hi2";

function HospitalCard({ name, location, specialization }) {
  const [showModal, setShowModal] = useState(false);

  const specializations = Array.isArray(specialization)
    ? specialization
    : [specialization];

  return (
    <div className="bg-white rounded-2xl border border-ink/5 shadow-sm p-5 hover:shadow-md transition">
      <div className="w-11 h-11 rounded-xl bg-teal-light flex items-center justify-center mb-4">
        <HiOutlineMapPin className="w-5 h-5 text-teal" />
      </div>

      <h2 className="text-lg font-display font-bold text-ink">{name}</h2>

      <p className="text-sm text-body mt-1 flex items-center gap-1.5">
        <HiOutlineMapPin className="w-4 h-4 text-muted" />
        {location}
      </p>

      <p className="text-xs font-semibold text-muted uppercase tracking-wide mt-4 mb-2">
        Specializations
      </p>

      <div className="flex flex-wrap gap-2">
        {Array.isArray(specialization) ? (
          specialization.map((item, index) => (
            <span
              key={index}
              className="bg-brand-light text-brand-dark px-3 py-1 rounded-full text-xs font-medium"
            >
              {item}
            </span>
          ))
        ) : (
          <span className="bg-brand-light text-brand-dark px-3 py-1 rounded-full text-xs font-medium">
            {specialization}
          </span>
        )}
      </div>

      <button
        onClick={() => setShowModal(true)}
        className="mt-5 w-full bg-brand text-white font-semibold py-2.5 rounded-xl hover:bg-brand-dark transition"
      >
        View Details
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-2xl w-full max-w-md relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-muted hover:text-ink"
              aria-label="Close"
            >
              <HiOutlineXMark className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-xl bg-teal-light flex items-center justify-center mb-4">
              <HiOutlineBuildingOffice2 className="w-6 h-6 text-teal" />
            </div>

            <h2 className="font-display text-xl font-bold text-ink mb-1">
              {name}
            </h2>

            <p className="text-sm text-body flex items-center gap-1.5 mb-5">
              <HiOutlineMapPin className="w-4 h-4 text-muted" />
              {location}
            </p>

            <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">
              Available Specialities
            </p>

            {specializations.length > 0 && specializations[0] ? (
              <ul className="space-y-2">
                {specializations.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-2 text-sm text-body bg-bg-soft rounded-xl px-3 py-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-teal shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted bg-bg-soft rounded-xl px-3 py-2">
                No specialities registered for this hospital yet.
              </p>
            )}

            <button
              onClick={() => setShowModal(false)}
              className="mt-5 w-full bg-bg-soft text-ink font-semibold py-2.5 rounded-xl hover:bg-ink/5 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default HospitalCard;
