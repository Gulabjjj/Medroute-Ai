const express = require("express");
const cors = require("cors");

const authRoutes = require(
  "./routes/authRoutes"
);
const hospitalRoutes = require(
  "./routes/hospitalRoutes"
);
const doctorRoutes = require(
  "./routes/doctorRoutes"
);
const appointmentRoutes = require(
  "./routes/appointmentRoutes"
);
const aiRoutes = require(
  "./routes/aiRoutes"
);
const dashboardRoutes =
  require(
    "./routes/dashboardRoutes"
);
const chatHistoryRoutes =
  require(
    "./routes/chatHistoryRoutes"
);
const reportRoutes = require(
  "./routes/reportRoutes"
);
const emergencyRoutes =
  require(
    "./routes/emergencyRoutes"
);
const adminRoutes =
  require(
    "./routes/adminRoutes"
);
const userRoutes =
  require(
    "./routes/userRoutes"
);

const app = express();

app.use(cors());
// Higher limit so base64 profile-picture uploads don't get rejected.
app.use(express.json({ limit: "5mb" }));

app.use(
  "/api/auth",
  authRoutes
);
app.use(
  "/api/hospitals",
  hospitalRoutes
);
app.use(
  "/api/doctors",
  doctorRoutes
);
app.use(
  "/api/appointments",
  appointmentRoutes
);
app.use(
  "/api/ai",
  aiRoutes
);
app.use(
  "/api/dashboard",
  dashboardRoutes
);
app.use(
  "/api/chat-history",
  chatHistoryRoutes
);
app.use(
  "/api/reports",
  reportRoutes
);
app.use(
  "/api/emergency",
  emergencyRoutes
);
app.use(
  "/api/admin",
  adminRoutes
);
app.use(
  "/api/users",
  userRoutes
);


app.get("/", (req, res) => {
  res.json({
    message: "MedRoute API Running",
  });
});

module.exports = app;