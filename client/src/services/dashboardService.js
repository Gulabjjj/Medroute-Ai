import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/dashboard`;

export const getDashboardStats = async () => {
  const { data } = await axios.get(`${API_URL}/stats`);

  return data;
};
