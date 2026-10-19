const Hospital = require("../models/Hospital");
const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");
const ChatHistory = require("../models/ChatHistory");

const getDashboardStats =
  async (req, res) => {
    try {
      const totalHospitals =
        await Hospital.countDocuments();

      const totalDoctors =
        await Doctor.countDocuments();

      const totalAppointments =
        await Appointment.countDocuments();

      const totalQueries =
        await ChatHistory.countDocuments();

      res.json({
        totalHospitals,
        totalDoctors,
        totalAppointments,
        totalQueries,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

module.exports = {
  getDashboardStats,
};