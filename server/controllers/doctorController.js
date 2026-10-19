const Doctor = require("../models/Doctor");

const getDoctors = async (
  req,
  res
) => {
  try {
    const doctors =
      await Doctor.find().sort({
        createdAt: -1,
      });

    res.json(doctors);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const createDoctor = async (
  req,
  res
) => {
  try {
    const {
      name,
      email,
      specialization,
      experience,
      hospital,
    } = req.body;

    const existingDoctor =
      await Doctor.findOne({
        email,
      });

    if (existingDoctor) {
      return res.status(400).json({
        message:
          "Doctor already exists",
      });
    }

    if (experience === undefined || experience === null || Number(experience) < 0) {
      return res.status(400).json({
        message:
          "Experience cannot be less than 0 years",
      });
    }

    const doctor =
      await Doctor.create({
        name,
        email,
        specialization,
        experience,
        hospital,
      });

    res.status(201).json(
      doctor
    );
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getDoctorByEmail =
  async (req, res) => {
    try {
      const doctor =
        await Doctor.findOne({
          email:
            req.params.email,
        });

      if (!doctor) {
        return res
          .status(404)
          .json({
            message:
              "Doctor not found",
          });
      }

      res.json(doctor);
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };

module.exports = {
  getDoctors,
  createDoctor,
  getDoctorByEmail,
};