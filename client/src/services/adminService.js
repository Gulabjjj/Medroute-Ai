import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/admin`;

export const getAdminStats = async () => {
  const { data } = await axios.get(`${API_URL}/stats`);

  return data;
};
