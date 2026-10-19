import api from "./api";

export const registerUser = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

export const loginUser = async (userData) => {
  const response = await api.post("/auth/login", userData);
  return response.data;
};

export const verifyEmail = async (email, otp) => {
  const response = await api.post("/auth/verify-email", { email, otp });
  return response.data;
};

export const resendOtp = async (email, purpose) => {
  const response = await api.post("/auth/resend-otp", { email, purpose });
  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await api.post("/auth/forgot-password", { email });
  return response.data;
};

export const resetPassword = async (email, otp, password) => {
  const response = await api.post("/auth/reset-password", {
    email,
    otp,
    password,
  });
  return response.data;
};

export const getProfile = async (token) => {
  const response = await api.get("/users/profile", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateProfile = async (token, updates) => {
  const response = await api.put("/users/profile", updates, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
