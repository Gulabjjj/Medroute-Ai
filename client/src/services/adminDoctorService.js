import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/doctors`;

export const getDoctors = async () => {
  const { data } = await axios.get(API_URL);

  return data;
};

export const createDoctor = async (doctorData) => {
  const { data } = await axios.post(API_URL, doctorData);

  return data;
};

export const deleteDoctor = async (id) => {
  const { data } = await axios.delete(`${API_URL}/${id}`);

  return data;
};
