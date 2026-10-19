import { useState } from "react";
import {
  HiOutlineBolt,
  HiOutlineBuildingOffice2,
  HiOutlineUserGroup,
  HiOutlineExclamationTriangle,
  HiOutlineMapPin,
  HiOutlineAcademicCap,
} from "react-icons/hi2";

import Sidebar from "../components/Sidebar";

import { getEmergencyHelp } from "../services/emergencyService";

const levelStyles = {
  HIGH: "bg-coral text-white",
  MEDIUM: "bg-amber text-white",
  LOW: "bg-teal text-white",
};

function Emergency() {
  const [symptom, setSymptom] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    if (!symptom.trim()) {
      alert("Please enter symptoms");
      return;
    }

    try {
      setLoading(true);
      const data = await getEmergencyHelp(symptom);
      setResult(data);
    } catch (error) {
      console.log(error);
      alert("Failed to check emergency");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 min-h-screen relative overflow-hidden bg-gradient-to-br from-bg-soft via-white to-coral-light/40 p-8">
        <div
          aria-hidden
          className="absolute -top-32 -right-24 w-[28rem] h-[28rem] rounded-full bg-coral-light blur-3xl animate-blob-pulse pointer-events-none"
        />
        <div
          aria-hidden
          className="absolute bottom-0 -left-32 w-96 h-96 rounded-full bg-amber-light blur-3xl animate-blob-pulse pointer-events-none"
          style={{ animationDelay: "3s" }}
        />

        <div className="relative">
        <div className="flex items-center gap-3 mb-1">
          <span className="w-9 h-9 rounded-xl bg-coral-light text-coral flex items-center justify-center">
            <HiOutlineBolt className="w-5 h-5" />
          </span>
          <h1 className="font-display text-3xl font-bold text-ink">
            Emergency Assistance
          </h1>
        </div>
        <p className="text-body text-sm mb-8">
          Describe what's happening and get routed to emergency care fast.
        </p>

        <div className="bg-white rounded-2xl border border-ink/5 shadow-sm p-6 max-w-2xl">
          <textarea
            rows="4"
            value={symptom}
            onChange={(e) => setSymptom(e.target.value)}
            placeholder="Describe symptoms..."
            className="w-full border border-ink/10 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-coral/30"
          />

          <button
            onClick={handleCheck}
            disabled={loading}
            className="mt-4 bg-coral text-white font-semibold px-6 py-3 rounded-xl hover:opacity-90 disabled:bg-muted transition"
          >
            {loading ? "Checking..." : "Check Emergency"}
          </button>
        </div>

        {result && result.isSymptom === false && (
          <div className="mt-6 max-w-2xl">
            <div className="flex items-center gap-2 bg-amber-light text-amber rounded-lg px-4 py-2.5 text-sm">
              <HiOutlineExclamationTriangle className="w-4 h-4 shrink-0" />
              <span>{result.message}</span>
            </div>
          </div>
        )}

        {result && result.isSymptom !== false && (
          <div className="mt-6 bg-white rounded-2xl border border-ink/5 shadow-sm p-6 max-w-2xl">
            <h2 className="font-display text-xl font-bold text-ink mb-4">
              Emergency Result
            </h2>

            <p className="mb-5 flex items-center gap-2">
              <span className="font-semibold text-ink text-sm">
                Emergency Level:
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  levelStyles[result.emergencyLevel] || "bg-muted text-white"
                }`}
              >
                {result.emergencyLevel}
              </span>
            </p>

            <div className="mb-5">
              <h3 className="font-display font-semibold text-ink mb-2">
                Immediate Actions
              </h3>
              <ul className="space-y-1.5">
                {result.immediateActions.map((action, index) => (
                  <li
                    key={index}
                    className="text-sm text-body flex items-start gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-coral mt-1.5 shrink-0" />
                    {action}
                  </li>
                ))}
              </ul>
            </div>

            {result.recommendedSpecialization && (
              <p className="mb-5 text-sm text-body">
                <span className="font-semibold text-ink">
                  Recommended Speciality:{" "}
                </span>
                {result.recommendedSpecialization}
              </p>
            )}

            {result.notifications?.length > 0 && (
              <div className="mb-5 space-y-1.5">
                {result.notifications.map((note, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-amber-light text-amber rounded-lg px-3 py-1.5 text-xs"
                  >
                    <HiOutlineExclamationTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{note}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="mb-5">
              <h3 className="font-display font-semibold text-ink mb-2 flex items-center gap-2">
                <HiOutlineBuildingOffice2 className="w-4 h-4 text-teal" />
                Recommended Hospitals
              </h3>

              {result.hospitals?.length > 0 ? (
                <div className="space-y-2">
                  {result.hospitals.map((hospital) => (
                    <div
                      key={hospital._id}
                      className="border border-ink/5 rounded-xl px-3 py-2.5"
                    >
                      <p className="font-semibold text-ink text-sm">
                        {hospital.name}
                      </p>
                      <p className="text-xs text-muted flex items-center gap-1 mt-0.5">
                        <HiOutlineMapPin className="w-3.5 h-3.5" />
                        {hospital.location}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {(Array.isArray(hospital.specialization)
                          ? hospital.specialization
                          : [hospital.specialization]
                        ).map((spec, i) => (
                          <span
                            key={i}
                            className="bg-brand-light text-brand-dark px-2.5 py-0.5 rounded-full text-xs font-medium"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted">
                  No registered hospitals available for this condition.
                </p>
              )}
            </div>

            <div>
              <h3 className="font-display font-semibold text-ink mb-2 flex items-center gap-2">
                <HiOutlineUserGroup className="w-4 h-4 text-teal" />
                Recommended Doctors
              </h3>

              {result.doctors?.length > 0 ? (
                <div className="space-y-2">
                  {result.doctors.map((doctor) => (
                    <div
                      key={doctor._id}
                      className="border border-ink/5 rounded-xl px-3 py-2.5"
                    >
                      <p className="font-semibold text-ink text-sm">
                        {doctor.name}
                      </p>
                      <p className="text-xs text-teal font-medium mt-0.5">
                        {doctor.specialization}
                      </p>
                      <p className="text-xs text-muted flex items-center gap-1 mt-1">
                        <HiOutlineAcademicCap className="w-3.5 h-3.5" />
                        {doctor.experience} Years Experience ·{" "}
                        {doctor.hospital}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted">
                  No registered doctors available for this condition.
                </p>
              )}
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}

export default Emergency;
