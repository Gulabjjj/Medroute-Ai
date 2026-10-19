import axios from "axios";

// In production, set VITE_API_URL in your hosting provider's environment
// variables (e.g. Vercel/Netlify project settings) to your deployed
// server's URL, e.g. https://medroute-server.onrender.com/api
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

export default api;
