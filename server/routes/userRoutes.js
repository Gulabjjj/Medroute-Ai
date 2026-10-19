const express = require("express");

const { getUsers, deleteUser, getProfile, updateProfile } = require(
  "../controllers/userController"
);
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Specific "/profile" routes must be registered before "/:id" so they
// aren't swallowed by the delete route's param matcher.
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

router.get("/", getUsers);
router.delete("/:id", deleteUser);

module.exports = router;
