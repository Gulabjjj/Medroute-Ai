const User = require("../models/User");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const generateToken = require("../utils/generateToken");
const { sendOtpEmail } = require("../utils/mailer");
const { isValidEmail } = require("../utils/validators");

const MIN_PASSWORD_LENGTH = 8;
const OTP_TTL_MS = (Number(process.env.OTP_EXPIRY_MINUTES) || 10) * 60 * 1000;

const hashOtp = (otp) =>
  crypto.createHash("sha256").update(otp).digest("hex");

const generateOtp = () =>
  String(Math.floor(100000 + Math.random() * 900000));

// Sends a fresh OTP to the user for the given purpose ("verify" | "reset").
// Returns { emailSent, devOtp } - devOtp is only set when there's no SMTP
// configured, so the flow can still be tested end-to-end locally.
const issueOtp = async (user, purpose) => {
  const otp = generateOtp();

  user.otpCode = hashOtp(otp);
  user.otpExpires = Date.now() + OTP_TTL_MS;
  user.otpPurpose = purpose;
  await user.save();

  const emailSent = await sendOtpEmail(user.email, otp, purpose);

  if (!emailSent) {
    console.log(`[MedRoute] OTP for ${user.email} (${purpose}): ${otp}`);
  }

  return { emailSent, devOtp: emailSent ? undefined : otp };
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        message: "Please enter a valid email address",
      });
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      return res.status(400).json({
        message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`,
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const userExists = await User.findOne({ email: normalizedEmail });

    if (userExists) {
      return res.status(400).json({
        message: "An account with this email already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role: role || "patient",
      // No email verification at signup. OTP is only used for
      // forgot/reset password.
      isVerified: true,
    });

    // Intentionally no token and no OTP: the client sends the user to the
    // login page after registering.
    res.status(201).json({
      message: "Account created successfully. Please log in.",
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Confirms the OTP sent at signup and activates the account.
const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and code are required" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({ message: "No account found with this email" });
    }

    if (user.isVerified) {
      return res.json({ message: "Account already verified. You can log in." });
    }

    if (
      user.otpPurpose !== "verify" ||
      !user.otpCode ||
      !user.otpExpires ||
      user.otpExpires < Date.now() ||
      user.otpCode !== hashOtp(String(otp).trim())
    ) {
      return res.status(400).json({ message: "That code is invalid or has expired" });
    }

    user.isVerified = true;
    user.otpCode = undefined;
    user.otpExpires = undefined;
    user.otpPurpose = undefined;
    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Re-sends a fresh OTP for either "verify" (unverified signup) or "reset"
// (forgot password) purposes.
const resendOtp = async (req, res) => {
  try {
    const { email, purpose } = req.body;

    if (!email || !["verify", "reset"].includes(purpose)) {
      return res.status(400).json({ message: "Email and a valid purpose are required" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({ message: "No account found with this email" });
    }

    if (purpose === "verify" && user.isVerified) {
      return res.json({ message: "Account already verified. You can log in." });
    }

    const { emailSent, devOtp } = await issueOtp(user, purpose);

    res.json({
      message: emailSent
        ? "A new code has been emailed to you."
        : "Email sending isn't configured on this server, so here is your code directly.",
      devOtp,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });

    // Only allow login if an account with this email actually exists.
    if (!user) {
      return res.status(404).json({
        message: "No account found with this email",
      });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Incorrect password",
      });
    }

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Step 1 of password reset: user submits their email. If an account exists,
// an OTP is emailed to them (or returned directly in dev mode without SMTP).
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ message: "Please enter a valid email address" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({
        message: "No account found with this email",
      });
    }

    const { emailSent, devOtp } = await issueOtp(user, "reset");

    res.json({
      message: emailSent
        ? "A 6-digit reset code has been emailed to you."
        : "Email sending isn't configured on this server, so here is your reset code directly.",
      email: user.email,
      devOtp,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Step 2: user submits the emailed OTP plus a new password.
const resetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and code are required" });
    }

    if (!password || password.length < MIN_PASSWORD_LENGTH) {
      return res.status(400).json({
        message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`,
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (
      !user ||
      user.otpPurpose !== "reset" ||
      !user.otpCode ||
      !user.otpExpires ||
      user.otpExpires < Date.now() ||
      user.otpCode !== hashOtp(String(otp).trim())
    ) {
      return res.status(400).json({
        message: "That code is invalid or has expired",
      });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.otpCode = undefined;
    user.otpExpires = undefined;
    user.otpPurpose = undefined;
    // A valid reset OTP already proves they control this inbox, so there's
    // no reason to make them verify the email again separately at login.
    user.isVerified = true;
    await user.save();

    res.json({ message: "Password updated successfully. Please log in." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  verifyEmail,
  resendOtp,
  forgotPassword,
  resetPassword,
};
