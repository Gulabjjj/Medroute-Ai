const User = require("../models/User");
const Doctor = require("../models/Doctor");
const Hospital = require("../models/Hospital");
const Appointment = require("../models/Appointment");

const getAdminStats =
  async (req, res) => {
    try {
      const users =
        await User.countDocuments({
          role: { $in: ["patient", "doctor"] },
        });

      const doctors =
        await Doctor.countDocuments();

      const hospitals =
        await Hospital.countDocuments();

      const appointments =
        await Appointment.countDocuments();

      res.json({
        users,
        doctors,
        hospitals,
        appointments,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

module.exports = {
  getAdminStats,
};