import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { HiOutlineArrowRight } from "react-icons/hi2";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");

    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    setUser(null);
    navigate("/");
    window.location.reload();
  };

  const isHome = location.pathname === "/";

  return (
    <nav
      className={`sticky top-0 z-50 transition-shadow ${
        scrolled
          ? "bg-white/90 backdrop-blur shadow-[0_1px_0_rgba(16,24,40,0.06),0_8px_24px_-16px_rgba(16,24,40,0.15)]"
          : "bg-white/70 backdrop-blur"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link
          to="/"
          className="font-display text-xl font-bold text-ink flex items-center gap-2"
        >
          <span className="w-8 h-8 rounded-lg bg-brand text-white flex items-center justify-center text-sm">
            +
          </span>
          MedRoute AI
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-body">
          {isHome ? (
            <>
              <a href="#features" className="hover:text-ink transition">
                Features
              </a>
              <a href="#why-choose" className="hover:text-ink transition">
                How It Works
              </a>
            </>
          ) : (
            <Link to="/" className="hover:text-ink transition">
              Home
            </Link>
          )}
        </div>

        <div className="flex items-center gap-4">
          {!user ? (
            <>
              <Link
                to="/login"
                className="hidden sm:inline text-sm font-medium text-body hover:text-ink transition"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="inline-flex items-center gap-1.5 bg-brand text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-brand-dark transition"
              >
                Get Started
                <HiOutlineArrowRight className="w-4 h-4" />
              </Link>
            </>
          ) : (
            <>
              <span className="hidden sm:inline text-sm font-medium text-ink">
                Welcome, {user.name}
              </span>

              <Link
                to="/dashboard"
                className="text-sm font-medium text-body hover:text-ink transition"
              >
                Dashboard
              </Link>

              <button
                onClick={handleLogout}
                className="bg-coral/90 text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-coral transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
