import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/chat-history`;

export const getUserChats = async (userId) => {
  const { data } = await axios.get(`${API_URL}/${userId}`);

  return data;
};
