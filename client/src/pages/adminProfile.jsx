import React, { useEffect, useState } from "react";
import axiosInstance from "../lib/axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom"
import { Eye, EyeOff, UserCircle2, ArrowLeft } from "lucide-react";
import Logo from "../assets/logo.png";

const AdminProfile = () => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false);

  const adminId = localStorage.getItem("userId");

  useEffect(() => {
    if (!adminId) {
      toast.error("Admin ID missing. Please log in again.");
      setLoading(false);
      return;
    }
    fetchAdmin();
  }, []);

  const fetchAdmin = async () => {
    try {
      const res = await axiosInstance.get(`/auth/getuser/${adminId}`);
      if (res.data.success) {
        setAdmin(res.data.user);
      }
    } catch (err) {
      toast.error("Failed to load admin profile");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!admin.firstName || !admin.lastName)
      return toast.error("First & last name are required");

    setSaving(true);

    try {
      const body = {
        firstName: admin.firstName,
        lastName: admin.lastName,
        password: admin.password || "",
      };

      const res = await axiosInstance.put(`/auth/adminupdate/${adminId}`, body);

      if (res.data.success) {
        toast.success("Profile updated successfully!");
        fetchAdmin();
      }
      
      setTimeout(() => {
          navigate("/dashboard")
      }, 800)
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !admin)
    return (
      <p className="text-center mt-6 text-gray-600 text-sm">
        Loading profile...
      </p>
    );

  return (
    <div className="min-h-auto bg-gray-50"> 
      <div className="w-full bg-gradient-to-r fixed top-0 left-0 h-23  from-gray-800 via-gray-600 to-gray-900 py-4 shadow-lg flex flex-col items-center text-white">
        <div className="flex items-center gap-3 ">
          <img
            src={Logo}
            alt="Logo"
            className="w-10 h-10 object-contain drop-shadow-md"
          />
          <h1 className="text-lg font-bold tracking-wide">
            SFCG NOI TASK MANAGEMENT
          </h1>
        </div>

        <p className="text-xs opacity-90 mt-1">
          Admin Profile Management — View & update your information
        </p>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-md mx-auto mt-8 px-4 py-20">
        <div className="bg-white rounded-xl shadow p-6 border border-gray-100">

          {/* Profile Icon */}
          <div className="flex flex-col items-center mb-4">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center shadow">
              <UserCircle2 size={55} className="text-gray-500" />
            </div>

            <h2 className="text-lg font-semibold text-gray-800 mt-3">
              {admin.firstName} {admin.lastName}
            </h2>
            <p className="text-gray-500 text-xs">
              Manage your personal profile settings
            </p>
          </div>

          {/* FORM INPUTS */}
          <div className="space-y-3 text-sm">

            {/* First Name */}
            <div>
              <label className="font-medium text-gray-700">First Name</label>
              <input
                type="text"
                value={admin.firstName}
                onChange={(e) =>
                  setAdmin({ ...admin, firstName: e.target.value })
                }
                className="w-full p-2 border rounded-lg mt-1 text-sm"
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                value={admin.lastName}
                onChange={(e) =>
                  setAdmin({ ...admin, lastName: e.target.value })
                }
                className="w-full p-2 border rounded-lg mt-1 text-sm"
              />
            </div>

           

            {/* Password */}
            <div className="relative">
              <label className="font-medium text-gray-700">
                New Password (Optional)
              </label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Leave blank to keep current"
                onChange={(e) =>
                  setAdmin({ ...admin, password: e.target.value })
                }
                className="w-full p-2 border rounded-lg mt-1 text-sm pr-10"
              />

              <div
                className="absolute right-3 top-9 cursor-pointer text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
            </div>
          </div>

          <button
            onClick={handleUpdate}
            disabled={saving}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg mt-6 text-sm font-medium transition"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <button
           onClick={() => { navigate(-1)}}
            className="w-full flex justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg mt-2 text-sm font-medium transition"
          >
           <ArrowLeft size={20} /> Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
