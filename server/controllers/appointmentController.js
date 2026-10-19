const Appointment = require(
  "../models/Appointment"
);

// "09:00 AM" -> 540 (minutes since midnight)
const timeToMinutes = (timeStr) => {
  const match = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec((timeStr || "").trim());
  if (!match) return 0;

  let [, hours, minutes, period] = match;
  hours = parseInt(hours, 10) % 12;
  if (period.toUpperCase() === "PM") hours += 12;

  return hours * 60 + parseInt(minutes, 10);
};

const isInThePast = (appointmentDate, appointmentTime) => {
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);

  if (appointmentDate < todayStr) return true;
  if (appointmentDate > todayStr) return false;

  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  return timeToMinutes(appointmentTime) <= nowMinutes;
};

const getAppointments =
  async (req, res) => {
    try {
      const appointments =
        await Appointment.find()
          .sort({
            createdAt: -1,
          });

      res.json(appointments);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

const createAppointment =
  async (req, res) => {
    try {
      const {
        userId,
        patientName,
        doctor,
        doctorEmail,
        hospital,
        appointmentDate,
        appointmentTime,
      } = req.body;

      if (isInThePast(appointmentDate, appointmentTime)) {
        return res.status(400).json({
          message: "Please choose a date and time in the future",
        });
      }

      const existingAppointment =
        await Appointment.findOne({
          userId,
          doctor,
          appointmentDate,
          appointmentTime,
          status: "Booked",
        });

      if (existingAppointment) {
        return res.status(400).json({
          message:
            "You already have an appointment with this doctor on this date and time",
        });
      }

      const doctorConflict =
        await Appointment.findOne({
          doctor,
          appointmentDate,
          appointmentTime,
          status: "Booked",
        });

      if (doctorConflict) {
        return res.status(400).json({
          message:
            "This time slot is already booked for the doctor",
        });
      }

      const appointment =
        await Appointment.create({
          userId,
          patientName,
          doctor,
          doctorEmail,
          hospital,
          appointmentDate,
          appointmentTime,
        });

      res.status(201).json(
        appointment
      );
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

const cancelAppointment =
  async (req, res) => {
    try {
      const appointment =
        await Appointment.findById(
          req.params.id
        );

      if (!appointment) {
        return res.status(404).json({
          message:
            "Appointment not found",
        });
      }

      appointment.status =
        "Cancelled";

      await appointment.save();

      res.json({
        message:
          "Appointment cancelled",
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

const getUserAppointments =
  async (req, res) => {
    try {
      const appointments =
        await Appointment.find({
          userId:
            req.params.userId,
        }).sort({
          createdAt: -1,
        });

      res.json(appointments);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

const getDoctorAppointments =
  async (req, res) => {
    try {
      const appointments =
        await Appointment.find({
          doctorEmail:
            req.params.email,
        }).sort({
          appointmentDate: 1,
        });

      res.json(appointments);
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };

const updateAppointmentStatus =
  async (req, res) => {
    try {
      const appointment =
        await Appointment.findById(
          req.params.id
        );

      if (!appointment) {
        return res.status(404).json({
          message:
            "Appointment not found",
        });
      }

      if (appointment.status === "Cancelled") {
        return res.status(400).json({
          message:
            "This appointment was cancelled by the patient and can no longer be updated",
        });
      }

      if (appointment.status === "Completed") {
        return res.status(400).json({
          message:
            "This appointment is already completed and can no longer be updated",
        });
      }

      if (
        req.body.status === "Completed" &&
        !isInThePast(
          appointment.appointmentDate,
          appointment.appointmentTime
        )
      ) {
        return res.status(400).json({
          message:
            "This appointment can only be marked Completed after its scheduled time",
        });
      }

      appointment.status =
        req.body.status;

      await appointment.save();

      res.json(
        appointment
      );
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };

module.exports = {
  getAppointments,
  getUserAppointments,
  createAppointment,
  cancelAppointment,
  getDoctorAppointments,
  updateAppointmentStatus,
};