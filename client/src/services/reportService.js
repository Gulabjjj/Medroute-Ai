import axios from "axios";

// Set VITE_API_URL / VITE_AI_URL in your hosting provider's environment
// variables when deploying — these default to local dev servers.
const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/reports`;
const FASTAPI_URL = import.meta.env.VITE_AI_URL || "http://127.0.0.1:8000";

export const analyzeReport = async (formData) => {
  const { data } = await axios.post(`${FASTAPI_URL}/analyze-report`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};

export const askReport = async (fileName, question) => {
  const { data } = await axios.post(`${FASTAPI_URL}/ask-report`, {
    fileName,
    question,
  });

  return data;
};

export const createReport = async (reportData) => {
  const { data } = await axios.post(API_URL, reportData);

  return data;
};

export const getUserReports = async (userId) => {
  const { data } = await axios.get(`${API_URL}/${userId}`);

  return data;
};
