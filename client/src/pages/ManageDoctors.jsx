import { useEffect, useState } from "react";
import { HiOutlineUserGroup, HiOutlinePlus, HiOutlineTrash } from "react-icons/hi2";

import Sidebar from "../components/Sidebar";

import {
  getDoctors,
  createDoctor,
  deleteDoctor,
} from "../services/adminDoctorService";

function ManageDoctors() {
  const [doctors, setDoctors] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    specialization: "",
    experience: "",
    hospital: "",
  });

  const fetchDoctors = async () => {
    try {
      const data = await getDoctors();
      setDoctors(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAdd = async () => {
    try {
      if (
        !formData.name ||
        !formData.email ||
        !formData.specialization ||
        !formData.experience ||
        !formData.hospital
      ) {
        return alert("Please fill all fields");
      }

      if (Number(formData.experience) < 0) {
        return alert("Experience cannot be less than 0 years");
      }

      await createDoctor(formData);

      alert("Doctor Added Successfully");

      setFormData({
        name: "",
        email: "",
        specialization: "",
        experience: "",
        hospital: "",
      });

      fetchDoctors();
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Failed to add doctor");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoctor(id);
      alert("Doctor Deleted Successfully");
      fetchDoctors();
    } catch (error) {
      console.log(error);
    }
  };

  const inputClass =
    "border border-ink/10 p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/30";

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 bg-bg-soft min-h-screen p-8">
        <h1 className="font-display text-3xl font-bold text-ink mb-1">
          Manage Doctors
        </h1>
        <p className="text-body text-sm mb-8">
          Add new doctors or remove existing ones from the network.
        </p>

        <div className="bg-white rounded-2xl border border-ink/5 shadow-sm p-6 mb-8">
          <h2 className="font-display text-lg font-bold text-ink mb-4">
            Add Doctor
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Doctor Name"
              value={formData.name}
              onChange={handleChange}
              className={inputClass}
            />

            <input
              type="email"
              name="email"
              placeholder="Doctor Email"
              value={formData.email}
              onChange={handleChange}
              className={inputClass}
            />

            <input
              type="text"
              name="specialization"
              placeholder="Specialization"
              value={formData.specialization}
              onChange={handleChange}
              className={inputClass}
            />

            <input
              type="number"
              name="experience"
              placeholder="Experience (Years)"
              value={formData.experience}
              onChange={handleChange}
              min="0"
              step="1"
              onKeyDown={(e) => {
                if (e.key === "-" || e.key === "e") e.preventDefault();
              }}
              className={inputClass}
            />

            <input
              type="text"
              name="hospital"
              placeholder="Hospital"
              value={formData.hospital}
              onChange={handleChange}
              className={`${inputClass} md:col-span-2`}
            />
          </div>

          <button
            onClick={handleAdd}
            className="mt-5 inline-flex items-center gap-2 bg-brand text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-brand-dark transition"
          >
            <HiOutlinePlus className="w-4 h-4" />
            Add Doctor
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-ink/5 shadow-sm p-6">
          <h2 className="font-display text-lg font-bold text-ink mb-4">
            Doctors List
          </h2>

          {doctors.map((doctor) => (
            <div
              key={doctor._id}
              className="border border-ink/5 rounded-2xl p-4 mb-4 last:mb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <h3 className="font-display font-bold text-ink">
                  {doctor.name}
                </h3>
                <p className="text-sm text-body">{doctor.email}</p>
                <p className="text-sm text-teal font-medium">
                  {doctor.specialization} · {doctor.experience} Years
                </p>
                <p className="text-sm text-muted">{doctor.hospital}</p>
              </div>

              <button
                onClick={() => handleDelete(doctor._id)}
                className="inline-flex items-center gap-1.5 bg-coral-light text-coral font-semibold px-4 py-2 rounded-xl hover:bg-coral hover:text-white transition text-sm shrink-0"
              >
                <HiOutlineTrash className="w-4 h-4" />
                Delete
              </button>
            </div>
          ))}

          {doctors.length === 0 && (
            <div className="bg-bg-soft rounded-xl p-6 text-center text-sm text-muted">
              <HiOutlineUserGroup className="w-6 h-6 mx-auto mb-2" />
              No doctors found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ManageDoctors;
