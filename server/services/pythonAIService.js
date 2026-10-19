const axios = require("axios");

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://127.0.0.1:8000";

const askAI = async (message) => {
  const response = await axios.post(
    `${AI_SERVICE_URL}/chat`,
    {
      message,
    }
  );

  return response.data;
};

module.exports = {
  askAI,
};