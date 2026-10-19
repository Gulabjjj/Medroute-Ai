const Report = require(
  "../models/Report"
);

const createReport =
  async (req, res) => {
    try {
      const {
        userId,
        fileName,
        analysis,
      } = req.body;

      const report =
        await Report.create({
          userId,
          fileName,
          analysis,
        });

      res.status(201).json(
        report
      );
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

const getUserReports =
  async (req, res) => {
    try {
      const reports =
        await Report.find({
          userId:
            req.params.userId,
        }).sort({
          createdAt: -1,
        });

      res.json(reports);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

module.exports = {
  createReport,
  getUserReports,
};