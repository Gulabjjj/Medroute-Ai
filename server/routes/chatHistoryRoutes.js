const express =
  require("express");

const router =
  express.Router();

const {
  saveChat,
  getUserChats,
} = require(
  "../controllers/chatHistoryController"
);

router.post("/", saveChat);

router.get(
  "/:userId",
  getUserChats
);

module.exports = router;