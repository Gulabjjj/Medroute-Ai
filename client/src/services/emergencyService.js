import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/emergency`;

export const getEmergencyHelp = async (symptom) => {
  const { data } = await axios.post(API_URL, {
    symptom,
  });

  return data;
};
