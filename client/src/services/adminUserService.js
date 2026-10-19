import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/users`;

export const getUsers = async () => {
  const { data } = await axios.get(API_URL);

  return data;
};

export const deleteUser = async (id) => {
  const { data } = await axios.delete(`${API_URL}/${id}`);

  return data;
};
