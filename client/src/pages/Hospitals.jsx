import { useEffect, useState } from "react";
import {
  HiOutlineMagnifyingGlass,
  HiOutlineBuildingOffice2,
} from "react-icons/hi2";

import Sidebar from "../components/Sidebar";
import HospitalCard from "../components/HospitalCard";
import Loader from "../components/Loader";
import Reveal from "../components/Reveal";

import { getHospitals } from "../services/hospitalService";

function Hospitals() {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [specialization, setSpecialization] = useState("All");

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const data = await getHospitals();
        setHospitals(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchHospitals();
  }, []);

  const filteredHospitals = hospitals.filter((hospital) => {
    const matchesSearch =
      hospital.name.toLowerCase().includes(search.toLowerCase()) ||
      hospital.location.toLowerCase().includes(search.toLowerCase()) ||
      hospital.specialization.some((spec) =>
        spec.toLowerCase().includes(search.toLowerCase())
      );

    const matchesSpecialization =
      specialization === "All" ||
      hospital.specialization.includes(specialization);

    return matchesSearch && matchesSpecialization;
  });

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 min-h-screen relative overflow-hidden bg-gradient-to-br from-bg-soft via-white to-teal-light/30 p-8">
        <div
          aria-hidden
          className="absolute -top-32 -right-24 w-[28rem] h-[28rem] rounded-full bg-teal-light blur-3xl animate-blob-pulse pointer-events-none"
        />
        <div
          aria-hidden
          className="absolute bottom-0 -left-32 w-96 h-96 rounded-full bg-brand-light blur-3xl animate-blob-pulse pointer-events-none"
          style={{ animationDelay: "3s" }}
        />

        <div className="relative">
        <h1 className="font-display text-3xl font-bold text-ink mb-1 animate-fade-in-up">
          Hospitals
        </h1>
        <p className="text-body text-sm mb-8 animate-fade-in-up" style={{ animationDelay: "80ms" }}>
          Find nearby hospitals by location or specialization.
        </p>

        <div className="bg-white rounded-2xl border border-ink/5 shadow-sm p-5 mb-8 animate-fade-in-up" style={{ animationDelay: "140ms" }}>
          <div className="relative mb-4">
            <HiOutlineMagnifyingGlass className="w-4 h-4 text-muted absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search hospital, city or specialization..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-ink/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"
            />
          </div>

          <select
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
            className="w-full border border-ink/10 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"
          >
            <option value="All">All Specializations</option>
            {[
              ...new Set(
                hospitals.flatMap((hospital) => hospital.specialization)
              ),
            ].map((spec) => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <Loader label="Loading hospitals..." />
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredHospitals.map((hospital, index) => (
                <Reveal key={hospital._id} delay={index * 60}>
                  <HospitalCard
                    name={hospital.name}
                    location={hospital.location}
                    specialization={hospital.specialization}
                  />
                </Reveal>
              ))}
            </div>

            {filteredHospitals.length === 0 && (
              <div className="bg-white rounded-2xl border border-ink/5 p-10 text-center mt-6 animate-fade-in-up">
                <HiOutlineBuildingOffice2 className="w-8 h-8 text-muted mx-auto mb-3" />
                <p className="font-medium text-ink">No hospitals found</p>
                <p className="text-sm text-muted mt-1">
                  Try adjusting your search or filters.
                </p>
              </div>
            )}
          </>
        )}
        </div>
      </div>
    </div>
  );
}

export default Hospitals;
