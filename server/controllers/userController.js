const User = require("../models/User");

const getUsers = async (
  req,
  res
) => {
  try {
    const users =
      await User.find({
        role: { $ne: "admin" },
      })
        .select("-password")
        .sort({
          createdAt: -1,
        });

    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteUser = async (
  req,
  res
) => {
  try {
    const user =
      await User.findById(
        req.params.id
      );

    if (!user) {
      return res.status(404).json({
        message:
          "User not found",
      });
    }

    await user.deleteOne();

    res.json({
      message:
        "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Returns the logged-in user's own profile (name, email, avatar, role).
const getProfile = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lets the logged-in user update their own name and/or avatar (base64 data
// URL or image URL). Email is intentionally not editable here since it's
// the account's unique identifier.
const updateProfile = async (req, res) => {
  try {
    const { name, avatar } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (typeof name === "string" && name.trim()) {
      user.name = name.trim();
    }

    if (typeof avatar === "string") {
      user.avatar = avatar;
    }

    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUsers,
  deleteUser,
  getProfile,
  updateProfile,
};