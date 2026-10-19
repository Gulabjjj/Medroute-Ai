const {
  askAI,
} = require("../services/pythonAIService");

const chatWithAI = async (
  req,
  res
) => {
  try {
    const { message } = req.body;

    const result = await askAI(
      message
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  chatWithAI,
};