require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");

connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server Running On Port ${PORT}`
  );

  if (process.env.EMAIL_USER && process.env.EMAIL_APP_PASSWORD) {
    console.log(`[MedRoute] Email sending ENABLED via ${process.env.EMAIL_USER}`);
  } else {
    console.log("[MedRoute] Email sending DISABLED — EMAIL_USER / EMAIL_APP_PASSWORD not found in .env (OTPs will print here instead)");
  }
});