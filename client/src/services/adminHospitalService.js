import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/hospitals`;

export const getHospitals = async () => {
  const { data } = await axios.get(API_URL);

  return data;
};

export const createHospital = async (hospitalData) => {
  const { data } = await axios.post(API_URL, hospitalData);

  return data;
};

export const deleteHospital = async (id) => {
  const { data } = await axios.delete(`${API_URL}/${id}`);

  return data;
};
