import { useEffect, useState } from "react";
import { HiOutlineUsers, HiOutlineTrash } from "react-icons/hi2";

import Sidebar from "../components/Sidebar";

import { getUsers, deleteUser } from "../services/adminUserService";

const roleStyles = {
  patient: "bg-brand-light text-brand-dark",
  doctor: "bg-teal-light text-teal",
  admin: "bg-amber-light text-amber",
};

function ManageUsers() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      alert("User Deleted Successfully");
      fetchUsers();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 bg-bg-soft min-h-screen p-8">
        <h1 className="font-display text-3xl font-bold text-ink mb-1">
          Manage Users
        </h1>
        <p className="text-body text-sm mb-8">
          View and remove accounts across MedRoute AI.
        </p>

        <div className="bg-white rounded-2xl border border-ink/5 shadow-sm p-6">
          <h2 className="font-display text-lg font-bold text-ink mb-4">
            Users List
          </h2>

          {users.map((user) => (
            <div
              key={user._id}
              className="border border-ink/5 rounded-2xl p-4 mb-4 last:mb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <h3 className="font-display font-bold text-ink">
                  {user.name}
                </h3>
                <p className="text-sm text-body">{user.email}</p>
                <span
                  className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                    roleStyles[user.role] || "bg-bg-soft text-body"
                  }`}
                >
                  {user.role}
                </span>
              </div>

              <button
                onClick={() => handleDelete(user._id)}
                className="inline-flex items-center gap-1.5 bg-coral-light text-coral font-semibold px-4 py-2 rounded-xl hover:bg-coral hover:text-white transition text-sm shrink-0"
              >
                <HiOutlineTrash className="w-4 h-4" />
                Delete
              </button>
            </div>
          ))}

          {users.length === 0 && (
            <div className="bg-bg-soft rounded-xl p-6 text-center text-sm text-muted">
              <HiOutlineUsers className="w-6 h-6 mx-auto mb-2" />
              No users found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ManageUsers;
