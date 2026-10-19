import { useEffect, useState } from "react";
import {
  HiOutlineBuildingOffice2,
  HiOutlinePlus,
  HiOutlineTrash,
} from "react-icons/hi2";

import Sidebar from "../components/Sidebar";

import {
  getHospitals,
  createHospital,
  deleteHospital,
} from "../services/adminHospitalService";

function ManageHospitals() {
  const [hospitals, setHospitals] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    specialization: "",
  });

  const fetchHospitals = async () => {
    try {
      const data = await getHospitals();
      setHospitals(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchHospitals();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAdd = async () => {
    try {
      if (!formData.name || !formData.location || !formData.specialization) {
        return alert("Please fill all fields");
      }

      await createHospital({
        ...formData,
        specialization: formData.specialization
          .split(",")
          .map((item) => item.trim()),
      });

      alert("Hospital Added Successfully");

      setFormData({ name: "", location: "", specialization: "" });

      fetchHospitals();
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Failed to add hospital");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteHospital(id);
      alert("Hospital Deleted Successfully");
      fetchHospitals();
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
          Manage Hospitals
        </h1>
        <p className="text-body text-sm mb-8">
          Add new hospitals or remove existing ones from the network.
        </p>

        <div className="bg-white rounded-2xl border border-ink/5 shadow-sm p-6 mb-8">
          <h2 className="font-display text-lg font-bold text-ink mb-4">
            Add Hospital
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Hospital Name"
              value={formData.name}
              onChange={handleChange}
              className={inputClass}
            />

            <input
              type="text"
              name="location"
              placeholder="Location"
              value={formData.location}
              onChange={handleChange}
              className={inputClass}
            />

            <input
              type="text"
              name="specialization"
              placeholder="Cardiology, Neurology, Dermatology"
              value={formData.specialization}
              onChange={handleChange}
              className={`${inputClass} md:col-span-2`}
            />
          </div>

          <button
            onClick={handleAdd}
            className="mt-5 inline-flex items-center gap-2 bg-brand text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-brand-dark transition"
          >
            <HiOutlinePlus className="w-4 h-4" />
            Add Hospital
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-ink/5 shadow-sm p-6">
          <h2 className="font-display text-lg font-bold text-ink mb-4">
            Hospitals List
          </h2>

          {hospitals.map((hospital) => (
            <div
              key={hospital._id}
              className="border border-ink/5 rounded-2xl p-4 mb-4 last:mb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <h3 className="font-display font-bold text-ink">
                  {hospital.name}
                </h3>
                <p className="text-sm text-body">{hospital.location}</p>
                <p className="text-sm text-teal font-medium">
                  {Array.isArray(hospital.specialization)
                    ? hospital.specialization.join(", ")
                    : hospital.specialization}
                </p>
              </div>

              <button
                onClick={() => handleDelete(hospital._id)}
                className="inline-flex items-center gap-1.5 bg-coral-light text-coral font-semibold px-4 py-2 rounded-xl hover:bg-coral hover:text-white transition text-sm shrink-0"
              >
                <HiOutlineTrash className="w-4 h-4" />
                Delete
              </button>
            </div>
          ))}

          {hospitals.length === 0 && (
            <div className="bg-bg-soft rounded-xl p-6 text-center text-sm text-muted">
              <HiOutlineBuildingOffice2 className="w-6 h-6 mx-auto mb-2" />
              No hospitals found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ManageHospitals;
