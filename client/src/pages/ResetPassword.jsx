import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeSlash,
  HiOutlineArrowRight,
} from "react-icons/hi2";

import AuthLayout from "../components/AuthLayout";
import { resetPassword } from "../services/authService";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const passwordTooShort = password.length > 0 && password.length < 8;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 8) {
      return alert("Password must be at least 8 characters long");
    }

    if (password !== confirmPassword) {
      return alert("Passwords do not match");
    }

    try {
      setLoading(true);
      const data = await resetPassword(token, password);
      alert(data.message || "Password updated successfully");
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Could not reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h1 className="font-display text-2xl font-bold text-ink text-center mb-1">
        Choose a new password
      </h1>
      <p className="text-sm text-body text-center mb-6">
        Make it something you haven't used before.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1.5 text-sm font-medium text-ink">
            New Password
          </label>
          <div className="relative">
            <HiOutlineLockClosed className="w-4 h-4 text-muted absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Min. 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              required
              className={`w-full border rounded-xl pl-10 pr-10 py-3 text-sm focus:outline-none focus:ring-2 transition ${
                passwordTooShort
                  ? "border-coral/50 focus:ring-coral/30 focus:border-coral/50"
                  : "border-ink/10 focus:ring-brand/30 focus:border-brand/40"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-ink transition"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <HiOutlineEyeSlash className="w-4 h-4" />
              ) : (
                <HiOutlineEye className="w-4 h-4" />
              )}
            </button>
          </div>
          <p className={`mt-1.5 text-xs ${passwordTooShort ? "text-coral" : "text-muted"}`}>
            Must be at least 8 characters
          </p>
        </div>

        <div>
          <label className="block mb-1.5 text-sm font-medium text-ink">
            Confirm Password
          </label>
          <div className="relative">
            <HiOutlineLockClosed className="w-4 h-4 text-muted absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full border border-ink/10 rounded-xl pl-10 pr-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand/40 transition"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 bg-brand text-white font-semibold py-3 rounded-xl hover:bg-brand-dark hover:scale-[1.01] disabled:bg-muted disabled:scale-100 transition"
        >
          {loading ? "Updating..." : "Update password"}
          {!loading && <HiOutlineArrowRight className="w-4 h-4" />}
        </button>
      </form>

      <p className="text-center text-sm text-body mt-6">
        <Link to="/login" className="text-brand font-semibold hover:text-brand-dark transition">
          Back to login
        </Link>
      </p>
    </AuthLayout>
  );
}

export default ResetPassword;
