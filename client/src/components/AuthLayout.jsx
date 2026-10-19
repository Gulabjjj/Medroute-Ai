import { Link } from "react-router-dom";
import { HiOutlineArrowLeft } from "react-icons/hi2";

function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-bg-soft flex relative">
      {/* Back to Home */}
      <Link
        to="/"
        className="absolute top-5 left-5 z-20 inline-flex items-center gap-1.5 bg-white/80 backdrop-blur text-ink text-xs font-semibold px-3.5 py-2 rounded-full border border-ink/10 shadow-sm hover:bg-white hover:-translate-x-0.5 transition"
      >
        <HiOutlineArrowLeft className="w-3.5 h-3.5" />
        Back to Home
      </Link>

      {/* Decorative side panel — hidden on small screens */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-linear-to-br from-brand via-brand to-brand-dark items-center justify-center p-12">
        <div
          aria-hidden
          className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-white/10 blur-3xl animate-blob-pulse"
        />
        <div
          aria-hidden
          className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-teal/20 blur-3xl animate-blob-pulse"
          style={{ animationDelay: "2s" }}
        />

        <div className="relative max-w-sm animate-fade-in-up">
          <span className="inline-block text-xs font-semibold tracking-wide uppercase text-white/70 mb-4">
            MedRoute AI
          </span>
          <h2 className="font-display text-4xl font-bold text-white mb-4 leading-snug">
            Your care network, in one place.
          </h2>
          <p className="text-brand-light/90 text-base leading-relaxed">
            AI-powered triage, verified doctors, real hospitals, and honest
            answers from your own reports — all in one calm, guided
            experience.
          </p>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex justify-center items-center px-4 py-12">
        <div className="w-full max-w-md animate-fade-in-up">
          <Link
            to="/"
            className="font-display text-xl font-bold text-ink flex items-center justify-center gap-2 mb-8 lg:hidden"
          >
            <span className="w-8 h-8 rounded-lg bg-brand text-white flex items-center justify-center text-sm">
              +
            </span>
            MedRoute AI
          </Link>

          <div className="bg-white shadow-[0_20px_60px_-25px_rgba(16,24,40,0.25)] rounded-3xl p-8 border border-ink/5">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
