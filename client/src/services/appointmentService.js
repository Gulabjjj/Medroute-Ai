import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/appointments`;

export const getAppointments = async () => {
  const { data } = await axios.get(API_URL);

  return data;
};

export const getUserAppointments = async (userId) => {
  const { data } = await axios.get(`${API_URL}/user/${userId}`);

  return data;
};

export const getDoctorAppointments = async (email) => {
  const { data } = await axios.get(`${API_URL}/doctor/${email}`);

  return data;
};

export const createAppointment = async (appointmentData) => {
  const { data } = await axios.post(API_URL, appointmentData);

  return data;
};

export const updateAppointmentStatus = async (id, status) => {
  const { data } = await axios.put(`${API_URL}/${id}/status`, {
    status,
  });

  return data;
};

export const cancelAppointment = async (id) => {
  const { data } = await axios.delete(`${API_URL}/${id}`);

  return data;
};
