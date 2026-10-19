import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { HiOutlineArrowRight } from "react-icons/hi2";

import AuthLayout from "../components/AuthLayout";
import { verifyEmail, resendOtp } from "../services/authService";

const RESEND_COOLDOWN = 30; // seconds

function VerifyEmail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const data = await verifyEmail(email, otp);

      localStorage.setItem("userInfo", JSON.stringify(data));
      alert("Email verified! Welcome to MedRoute AI.");
      navigate("/dashboard");
      window.location.reload();
    } catch (error) {
      alert(error.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      const data = await resendOtp(email, "verify");
      if (data.devOtp) {
        alert(`Dev mode (no SMTP configured) — your code is: ${data.devOtp}`);
      } else {
        alert(data.message);
      }
      setCooldown(RESEND_COOLDOWN);
    } catch (error) {
      alert(error.response?.data?.message || "Could not resend code");
    }
  };

  return (
    <AuthLayout>
      <h1 className="font-display text-2xl font-bold text-ink text-center mb-1">
        Verify your email
      </h1>
      <p className="text-sm text-body text-center mb-6">
        Enter the 6-digit code we sent to{" "}
        <span className="font-semibold text-ink">{email || "your email"}</span>.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={6}
          placeholder="000000"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          required
          className="w-full text-center tracking-[0.5em] text-xl font-semibold border border-ink/10 rounded-xl py-3 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand/40 transition"
        />

        <button
          type="submit"
          disabled={loading || otp.length !== 6}
          className="w-full inline-flex items-center justify-center gap-2 bg-brand text-white font-semibold py-3 rounded-xl hover:bg-brand-dark hover:scale-[1.01] disabled:bg-muted disabled:scale-100 transition"
        >
          {loading ? "Verifying..." : "Verify"}
          {!loading && <HiOutlineArrowRight className="w-4 h-4" />}
        </button>
      </form>

      <p className="text-center text-sm text-body mt-6">
        Didn't get a code?{" "}
        <button
          type="button"
          onClick={handleResend}
          disabled={cooldown > 0}
          className="text-brand font-semibold hover:text-brand-dark transition disabled:text-muted disabled:cursor-not-allowed"
        >
          {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
        </button>
      </p>

      <p className="text-center text-sm text-body mt-2">
        <Link to="/login" className="text-brand font-semibold hover:text-brand-dark transition">
          Back to login
        </Link>
      </p>
    </AuthLayout>
  );
}

export default VerifyEmail;
