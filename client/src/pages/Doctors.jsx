import { useEffect, useState } from "react";
import { HiOutlineMagnifyingGlass, HiOutlineUserGroup } from "react-icons/hi2";

import Sidebar from "../components/Sidebar";
import DoctorCard from "../components/DoctorCard";
import Loader from "../components/Loader";
import Reveal from "../components/Reveal";

import { getDoctors } from "../services/doctorService";

function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [specialization, setSpecialization] = useState("All");
  const [experienceFilter, setExperienceFilter] = useState("All");

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await getDoctors();
        setDoctors(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const specializationOptions = Array.from(
    new Map(
      doctors
        .map((doctor) => (doctor.specialization || "").trim())
        .filter(Boolean)
        .map((spec) => [spec.toLowerCase(), spec])
    ).values()
  ).sort((a, b) => a.localeCompare(b));

  const filteredDoctors = doctors.filter((doctor) => {
    const doctorSpecialization = (doctor.specialization || "").trim().toLowerCase();
    const searchTerm = search.trim().toLowerCase();

    const matchesSearch =
      doctor.name.toLowerCase().includes(searchTerm) ||
      doctorSpecialization.includes(searchTerm);

    const matchesSpecialization =
      specialization === "All" ||
      doctorSpecialization === specialization.trim().toLowerCase();

    let matchesExperience = true;

    if (experienceFilter === "0-5") {
      matchesExperience = doctor.experience <= 5;
    }

    if (experienceFilter === "5-10") {
      matchesExperience = doctor.experience > 5 && doctor.experience <= 10;
    }

    if (experienceFilter === "10+") {
      matchesExperience = doctor.experience > 10;
    }

    return matchesSearch && matchesSpecialization && matchesExperience;
  });

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
        <h1 className="font-display text-3xl font-bold text-ink mb-1 animate-fade-in-up">
          Doctors
        </h1>
        <p className="text-body text-sm mb-8 animate-fade-in-up" style={{ animationDelay: "80ms" }}>
          Find and book a verified specialist near you.
        </p>

        <div className="bg-white rounded-2xl border border-ink/5 shadow-sm p-5 mb-8 animate-fade-in-up" style={{ animationDelay: "140ms" }}>
          <div className="relative mb-4">
            <HiOutlineMagnifyingGlass className="w-4 h-4 text-muted absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search doctor or specialization..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-ink/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <select
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              className="w-full border border-ink/10 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"
            >
              <option value="All">All Specializations</option>
              {specializationOptions.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>

            <select
              value={experienceFilter}
              onChange={(e) => setExperienceFilter(e.target.value)}
              className="w-full border border-ink/10 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"
            >
              <option value="All">All Experience</option>
              <option value="0-5">0 - 5 Years</option>
              <option value="5-10">5 - 10 Years</option>
              <option value="10+">10+ Years</option>
            </select>
          </div>
        </div>

        {loading ? (
          <Loader label="Loading doctors..." />
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDoctors.map((doctor, index) => (
                <Reveal key={doctor._id} delay={index * 60}>
                  <DoctorCard doctor={doctor} />
                </Reveal>
              ))}
            </div>

            {filteredDoctors.length === 0 && (
              <div className="bg-white rounded-2xl border border-ink/5 p-10 text-center mt-6 animate-fade-in-up">
                <HiOutlineUserGroup className="w-8 h-8 text-muted mx-auto mb-3" />
                <p className="font-medium text-ink">No doctors found</p>
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

export default Doctors;
