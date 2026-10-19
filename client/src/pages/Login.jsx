import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  HiOutlineEnvelope,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeSlash,
  HiOutlineArrowRight,
} from "react-icons/hi2";

import AuthLayout from "../components/AuthLayout";
import { loginUser } from "../services/authService";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = await loginUser({ email, password });

      localStorage.setItem("userInfo", JSON.stringify(data));

      if (data.role === "admin") {
        navigate("/admin-dashboard");
      } else if (data.role === "doctor") {
        navigate("/doctor-dashboard");
      } else {
        navigate("/dashboard");
      }

      window.location.reload();
    } catch (error) {
      const data = error.response?.data;

      alert(data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h1 className="font-display text-2xl font-bold text-ink text-center mb-1">
        Welcome back
      </h1>
      <p className="text-sm text-body text-center mb-6">
        Log in to reach your care, faster.
      </p>

      <form
        id="login-form"
        onSubmit={handleSubmit}
        autoComplete="on"
        className="space-y-4"
      >
        <div>
          <label className="block mb-1.5 text-sm font-medium text-ink">
            Email
          </label>

          <div className="relative">
            <HiOutlineEnvelope className="w-4 h-4 text-muted absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              name="email"
              autoComplete="username"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-ink/10 rounded-xl pl-10 pr-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand/40 transition"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-medium text-ink">
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-xs font-semibold text-brand hover:text-brand-dark transition"
            >
              Forgot password?
            </Link>
          </div>

          <div className="relative">
            <HiOutlineLockClosed className="w-4 h-4 text-muted absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-ink/10 rounded-xl pl-10 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand/40 transition"
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
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 bg-brand text-white font-semibold py-3 rounded-xl hover:bg-brand-dark hover:scale-[1.01] disabled:bg-muted disabled:scale-100 transition"
        >
          {loading ? "Logging in..." : "Login"}
          {!loading && <HiOutlineArrowRight className="w-4 h-4" />}
        </button>
      </form>

      <p className="text-center text-sm text-body mt-6">
        Don't have an account?{" "}
        <Link to="/register" className="text-brand font-semibold hover:text-brand-dark transition">
          Create one
        </Link>
      </p>
    </AuthLayout>
  );
}

export default Login;
