import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  HiOutlineUser,
  HiOutlineEnvelope,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeSlash,
  HiOutlineArrowRight,
  HiOutlineIdentification,
} from "react-icons/hi2";

import AuthLayout from "../components/AuthLayout";
import { registerUser } from "../services/authService";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("patient");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const passwordTooShort = password.length > 0 && password.length < 8;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 8) {
      return alert("Password must be at least 8 characters long");
    }

    try {
      setLoading(true);

      await registerUser({ name, email, password, role });

      alert("Account created successfully! Please log in.");

      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h1 className="font-display text-2xl font-bold text-ink text-center mb-1">
        Create your account
      </h1>
      <p className="text-sm text-body text-center mb-6">
        Get matched with the right care in seconds.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1.5 text-sm font-medium text-ink">
            Full Name
          </label>

          <div className="relative">
            <HiOutlineUser className="w-4 h-4 text-muted absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border border-ink/10 rounded-xl pl-10 pr-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand/40 transition"
            />
          </div>
        </div>

        <div>
          <label className="block mb-1.5 text-sm font-medium text-ink">
            Email
          </label>

          <div className="relative">
            <HiOutlineEnvelope className="w-4 h-4 text-muted absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-ink/10 rounded-xl pl-10 pr-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand/40 transition"
            />
          </div>
        </div>

        <div>
          <label className="block mb-1.5 text-sm font-medium text-ink">
            Password
          </label>

          <div className="relative">
            <HiOutlineLockClosed className="w-4 h-4 text-muted absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Create a password (min. 8 characters)"
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
            {passwordTooShort
              ? `${8 - password.length} more character${8 - password.length === 1 ? "" : "s"} needed`
              : "Must be at least 8 characters"}
          </p>
        </div>

        <div>
          <label className="block mb-1.5 text-sm font-medium text-ink">
            Register As
          </label>

          <div className="relative">
            <HiOutlineIdentification className="w-4 h-4 text-muted absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full appearance-none border border-ink/10 rounded-xl pl-10 pr-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand/40 transition"
            >
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 bg-brand text-white font-semibold py-3 rounded-xl hover:bg-brand-dark hover:scale-[1.01] disabled:bg-muted disabled:scale-100 transition"
        >
          {loading ? "Creating account..." : "Register"}
          {!loading && <HiOutlineArrowRight className="w-4 h-4" />}
        </button>
      </form>

      <p className="text-center text-sm text-body mt-6">
        Already have an account?{" "}
        <Link to="/login" className="text-brand font-semibold hover:text-brand-dark transition">
          Login
        </Link>
      </p>
    </AuthLayout>
  );
}

export default Register;
