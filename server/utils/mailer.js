// Sends OTP emails (signup verification + password reset) via Gmail SMTP.
//
// Reads credentials from:
//   EMAIL_USER            - the Gmail address to send from
//   EMAIL_APP_PASSWORD    - a 16-character Gmail "App Password"
//                           (NOT your normal Gmail password — generate one at
//                           https://myaccount.google.com/apppasswords)
//
// If these aren't set (or nodemailer isn't installed), sendOtpEmail()
// returns false and the caller falls back to logging/returning the OTP
// directly, so the flow still works locally without email configured.
let nodemailer;
try {
  nodemailer = require("nodemailer");
} catch {
  nodemailer = null;
}

const isConfigured = () =>
  Boolean(nodemailer && process.env.EMAIL_USER && process.env.EMAIL_APP_PASSWORD);

let cachedTransporter = null;

const getTransporter = () => {
  if (!cachedTransporter) {
    cachedTransporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });
  }
  return cachedTransporter;
};

const COPY = {
  verify: {
    subject: "Verify your MedRoute AI account",
    heading: "Confirm your email",
    body: "Use the code below to verify your MedRoute AI account.",
  },
  reset: {
    subject: "Your MedRoute AI password reset code",
    heading: "Reset your password",
    body: "Use the code below to reset your MedRoute AI password.",
  },
};

async function sendOtpEmail(toEmail, otp, purpose = "verify") {
  if (!isConfigured()) {
    return false;
  }

  const copy = COPY[purpose] || COPY.verify;
  const expiryMinutes = Number(process.env.OTP_EXPIRY_MINUTES) || 10;

  try {
    const transporter = getTransporter();

    await transporter.sendMail({
      from: `"MedRoute AI" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: copy.subject,
      html: `
        <div style="font-family:sans-serif;max-width:420px">
          <h2 style="margin-bottom:4px">${copy.heading}</h2>
          <p style="color:#555">${copy.body}</p>
          <p style="font-size:32px;font-weight:700;letter-spacing:6px;margin:20px 0">${otp}</p>
          <p style="color:#888;font-size:13px">This code expires in ${expiryMinutes} minutes. If you didn't request this, you can safely ignore this email.</p>
        </div>
      `,
    });

    return true;
  } catch (error) {
    console.error("[MedRoute] Failed to send OTP email:", error.message);
    return false;
  }
}

module.exports = { sendOtpEmail };
