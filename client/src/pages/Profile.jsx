import { useEffect, useRef, useState } from "react";
import Sidebar from "../components/Sidebar";
import {
  HiOutlineEnvelope,
  HiOutlineUser,
  HiOutlineCamera,
  HiOutlineShieldCheck,
} from "react-icons/hi2";
import { getProfile, updateProfile } from "../services/authService";

function Profile() {
  const storedUser = JSON.parse(localStorage.getItem("userInfo") || "null");

  const [profile, setProfile] = useState(storedUser);
  const [name, setName] = useState(storedUser?.name || "");
  const [avatar, setAvatar] = useState(storedUser?.avatar || "");
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getProfile(storedUser?.token);
        setProfile(data);
        setName(data.name);
        setAvatar(data.avatar || "");
      } catch (error) {
        console.log(error);
      }
    };

    if (storedUser?.token) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      return alert("Please choose an image under 2MB");
    }

    const reader = new FileReader();
    reader.onloadend = () => setAvatar(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      const updated = await updateProfile(storedUser.token, { name, avatar });

      const merged = { ...storedUser, name: updated.name, avatar: updated.avatar };
      localStorage.setItem("userInfo", JSON.stringify(merged));

      setProfile(updated);
      alert("Profile updated successfully");
      window.location.reload();
    } catch (error) {
      alert(error.response?.data?.message || "Could not update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex bg-bg-soft min-h-screen">
      <Sidebar />

      <main className="flex-1 p-8 max-w-3xl">
        <h1 className="font-display text-2xl font-bold text-ink mb-1">
          My Profile
        </h1>
        <p className="text-sm text-body mb-8">
          Manage your personal details and profile photo.
        </p>

        <div className="bg-white rounded-2xl border border-ink/5 shadow-sm p-8">
          <div className="flex items-center gap-5 mb-8">
            <div className="relative">
              {avatar ? (
                <img
                  src={avatar}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover border border-ink/10"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-brand-light text-brand-dark font-display font-bold text-2xl flex items-center justify-center">
                  {(name || "U").charAt(0).toUpperCase()}
                </div>
              )}

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-brand text-white flex items-center justify-center border-2 border-white hover:bg-brand-dark transition"
                aria-label="Change profile photo"
              >
                <HiOutlineCamera className="w-3.5 h-3.5" />
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>

            <div>
              <p className="font-display text-lg font-bold text-ink">
                {profile?.name}
              </p>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-teal bg-teal-light px-2.5 py-1 rounded-full capitalize">
                <HiOutlineShieldCheck className="w-3.5 h-3.5" />
                {profile?.role}
              </span>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4 max-w-md">
            <div>
              <label className="block mb-1.5 text-sm font-medium text-ink">
                Full Name
              </label>
              <div className="relative">
                <HiOutlineUser className="w-4 h-4 text-muted absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full border border-ink/10 rounded-xl pl-10 pr-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand/40 transition"
                />
              </div>
            </div>

            <div>
              <label className="block mb-1.5 text-sm font-medium text-ink">
                Email Address
              </label>
              <div className="relative">
                <HiOutlineEnvelope className="w-4 h-4 text-muted absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={profile?.email || ""}
                  disabled
                  className="w-full border border-ink/10 bg-bg-soft text-muted rounded-xl pl-10 pr-3 py-3 text-sm cursor-not-allowed"
                />
              </div>
              <p className="mt-1.5 text-xs text-muted">
                Your email is your login ID and can't be changed here.
              </p>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto bg-brand text-white font-semibold px-6 py-3 rounded-xl hover:bg-brand-dark disabled:bg-muted transition"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default Profile;
