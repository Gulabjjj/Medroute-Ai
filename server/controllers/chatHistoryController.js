const ChatHistory =
  require("../models/ChatHistory");

const saveChat =
  async (req, res) => {
    try {
      const {
        userId,
        query,
        response,
        route,
      } = req.body;

      const chat =
        await ChatHistory.create({
          userId,
          query,
          response,
          route,
        });

      res.status(201).json(chat);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

const getUserChats =
  async (req, res) => {
    try {
      const chats =
        await ChatHistory.find({
          userId:
            req.params.userId,
        }).sort({
          createdAt: -1,
        });

      res.json(chats);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

module.exports = {
  saveChat,
  getUserChats,
};