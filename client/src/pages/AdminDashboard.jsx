import { useEffect, useState } from "react";
import {
  HiOutlineUsers,
  HiOutlineUserGroup,
  HiOutlineBuildingOffice2,
  HiOutlineCalendarDays,
} from "react-icons/hi2";

import Sidebar from "../components/Sidebar";
import StatCard from "../components/Statcard";

import { getAdminStats } from "../services/adminService";

function AdminDashboard() {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const [stats, setStats] = useState({
    users: 0,
    doctors: 0,
    hospitals: 0,
    appointments: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getAdminStats();
        setStats(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 bg-bg-soft min-h-screen p-8">
        <h1 className="font-display text-3xl font-bold text-ink mb-1">
          Admin Dashboard
        </h1>
        <p className="text-body text-sm mb-8">
          Manage hospitals, doctors, users and appointments.
        </p>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Users"
            value={stats.users}
            tone="brand"
            icon={<HiOutlineUsers className="w-5 h-5" />}
          />
          <StatCard
            title="Doctors"
            value={stats.doctors}
            tone="teal"
            icon={<HiOutlineUserGroup className="w-5 h-5" />}
          />
          <StatCard
            title="Hospitals"
            value={stats.hospitals}
            tone="amber"
            icon={<HiOutlineBuildingOffice2 className="w-5 h-5" />}
          />
          <StatCard
            title="Appointments"
            value={stats.appointments}
            tone="coral"
            icon={<HiOutlineCalendarDays className="w-5 h-5" />}
          />
        </div>

        <div className="bg-white rounded-2xl border border-ink/5 shadow-sm p-6">
          <h2 className="font-display text-xl font-bold text-ink mb-2">
            Welcome, {userInfo?.name}
          </h2>
          <p className="text-sm text-body">
            Use the sidebar to manage hospitals, doctors, users, and
            appointments across MedRoute AI.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
