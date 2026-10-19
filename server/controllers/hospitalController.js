const Hospital = require("../models/Hospital");

const getHospitals = async (
  req,
  res
) => {
  try {
    const hospitals =
      await Hospital.find().sort({
        createdAt: -1,
      });

    res.json(hospitals);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const createHospital = async (
  req,
  res
) => {
  try {
    const {
      name,
      location,
      specialization,
    } = req.body;

    const existingHospital =
      await Hospital.findOne({
        name,
      });

    if (existingHospital) {
      return res.status(400).json({
        message:
          "Hospital already exists",
      });
    }

    const hospital =
      await Hospital.create({
        name,
        location,
        specialization,
      });

    res.status(201).json(
      hospital
    );
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteHospital =
  async (req, res) => {
    try {
      const hospital =
        await Hospital.findById(
          req.params.id
        );

      if (!hospital) {
        return res.status(404).json({
          message:
            "Hospital not found",
        });
      }

      await hospital.deleteOne();

      res.json({
        message:
          "Hospital deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };

module.exports = {
  getHospitals,
  createHospital,
  deleteHospital,
};