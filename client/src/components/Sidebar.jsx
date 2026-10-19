import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  HiOutlineHome,
  HiOutlineSquares2X2,
  HiOutlineBuildingOffice2,
  HiOutlineUserGroup,
  HiOutlineCalendarDays,
  HiOutlineChatBubbleLeftRight,
  HiOutlineClock,
  HiOutlineDocumentArrowUp,
  HiOutlineDocumentText,
  HiOutlineBolt,
  HiOutlineChartBarSquare,
  HiOutlineUsers,
  HiOutlineArrowRightOnRectangle,
} from "react-icons/hi2";

const patientLinks = [
  { to: "/", label: "Home", icon: HiOutlineHome },
  { to: "/dashboard", label: "Dashboard", icon: HiOutlineSquares2X2 },
  { to: "/hospitals", label: "Hospitals", icon: HiOutlineBuildingOffice2 },
  { to: "/doctors", label: "Doctors", icon: HiOutlineUserGroup },
  { to: "/appointments", label: "Appointments", icon: HiOutlineCalendarDays },
  { to: "/chat", label: "AI Chat", icon: HiOutlineChatBubbleLeftRight },
  { to: "/chat-history", label: "My Chats", icon: HiOutlineClock },
  { to: "/upload-report", label: "Upload Report", icon: HiOutlineDocumentArrowUp },
  { to: "/report-history", label: "My Reports", icon: HiOutlineDocumentText },
  { to: "/emergency", label: "Emergency", icon: HiOutlineBolt },
];

// The doctor already reaches the dashboard via the sidebar logo/header,
// and "My Patients" has its own button directly on the Doctor Dashboard —
// so there's nothing else to list here.
const doctorLinks = [];

const adminLinks = [
  { to: "/", label: "Home", icon: HiOutlineHome },
  { to: "/admin-dashboard", label: "Admin Dashboard", icon: HiOutlineChartBarSquare },
  { to: "/manage-doctors", label: "Manage Doctors", icon: HiOutlineUserGroup },
  { to: "/manage-hospitals", label: "Manage Hospitals", icon: HiOutlineBuildingOffice2 },
  { to: "/manage-users", label: "Manage Users", icon: HiOutlineUsers },
];

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
    window.location.reload();
  };

  const links =
    userInfo?.role === "doctor"
      ? doctorLinks
      : userInfo?.role === "admin"
      ? adminLinks
      : patientLinks;

  const homeTo =
    userInfo?.role === "doctor"
      ? "/doctor-dashboard"
      : userInfo?.role === "admin"
      ? "/admin-dashboard"
      : "/";

  return (
    <div className="w-64 shrink-0 h-screen sticky top-0 overflow-y-auto bg-white border-r border-ink/5 p-5 flex flex-col">
      <Link
        to={homeTo}
        className="font-display text-xl font-bold text-ink flex items-center gap-2 px-2 mb-8"
      >
        <span className="w-8 h-8 rounded-lg bg-brand text-white flex items-center justify-center text-sm">
          +
        </span>
        MedRoute AI
      </Link>

      <div className="flex flex-col gap-1 flex-1">
        {links.map(({ to, label, icon: Icon }) => {
          const active =
            to === "/"
              ? location.pathname === "/"
              : location.pathname === to;

          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                active
                  ? "bg-brand-light text-brand-dark"
                  : "text-body hover:bg-bg-soft hover:text-ink"
              }`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </Link>
          );
        })}
      </div>

      <div className="pt-4 border-t border-ink/5">
        {userInfo?.name && (
          <Link
            to="/profile"
            className="flex items-center gap-3 px-2 mb-3 rounded-xl py-1.5 -mx-1 hover:bg-bg-soft transition"
          >
            {userInfo.avatar ? (
              <img
                src={userInfo.avatar}
                alt=""
                className="w-9 h-9 rounded-full object-cover border border-ink/10"
              />
            ) : (
              <span className="w-9 h-9 rounded-full bg-brand-light text-brand-dark font-display font-bold flex items-center justify-center text-sm">
                {userInfo.name.charAt(0).toUpperCase()}
              </span>
            )}
            <div className="min-w-0">
              <p className="text-sm font-semibold text-ink truncate">
                {userInfo.name}
              </p>
              <p className="text-xs text-muted truncate">
                {userInfo.email}
              </p>
            </div>
          </Link>
        )}

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-coral-light text-coral hover:bg-coral hover:text-white transition font-semibold text-sm px-3 py-2.5 rounded-xl"
        >
          <HiOutlineArrowRightOnRectangle className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
