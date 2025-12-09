import React, { useEffect, useState } from "react";
import axiosInstance from "../lib/axios";
import { toast } from "react-hot-toast";
import { Eye, EyeOff, UserCircle2, ArrowLeft} from "lucide-react";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate()
  const [departmentList, setDepartmentList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchUser();
    fetchDepartments();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await axiosInstance.get(`/auth/getuser/${userId}`);
      if (res.data.success) {
        const usr = res.data.user;
        setUser(usr);

        // preload categories based on current department
        const dept = departmentList.find(
          (d) => d.departmentName === usr.department
        );
        setCategoryList(dept?.categories || []);
      }
    } catch {
      toast.error("Failed to load user profile");
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------
      LOAD DEPARTMENTS
  -------------------------- */
  const fetchDepartments = async () => {
    try {
      const res = await axiosInstance.get("/department/getalldepartment");
      setDepartmentList(res.data.departments || []);
    } catch {
      toast.error("Failed to load departments");
    }
  };

  /* -------------------------
      HANDLE DEPARTMENT CHANGE
  -------------------------- */
  const handleDepartmentSelect = (e) => {
    const value = e.target.value;

    setUser((prev) => ({
      ...prev,
      department: value,
      category: "", // reset category
    }));

    const selected = departmentList.find(
      (d) => d.departmentName === value
    );

    setCategoryList(selected?.categories || []);
  };

  /* -------------------------
      SAVE PROFILE
  -------------------------- */
  const handleUpdate = async () => {
    if (!user.firstName || !user.lastName)
      return toast.error("First & last name are required");

    setSaving(true);

    try {
      const body = {
        firstName: user.firstName,
        lastName: user.lastName,
        department: user.department,
        category: user.category,
        password: user.password || "",
      };

      const res = await axiosInstance.put(`/auth/update/${userId}`, body);

      if (res.data.success) {
        toast.success("Profile updated successfully!");
        fetchUser();
      }

      setTimeout(() => {
          navigate("/staffdashboard")
      })
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !user)
    return (
      <p className="text-center mt-6 text-gray-600 text-sm">
        Loading profile...
      </p>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-10">

      {/* Header */}
      <div className="w-full bg-gradient-to-r from-gray-800 to-gray-900 text-white py-4 shadow text-center fixed top-0 left-0">
        <h1 className="text-lg font-bold tracking-wide">
          USER PROFILE
        </h1>
        <p className="text-xs opacity-80">Update your personal information</p>
      </div>

      {/* Main */}
      <div className="max-w-md mx-auto mt-24 px-4">
        <div className="bg-white rounded-xl shadow p-6 border border-gray-100">

          {/* Profile Icon */}
          <div className="flex flex-col items-center mb-4">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center shadow">
              <UserCircle2 size={55} className="text-gray-500" />
            </div>

            <h2 className="text-lg font-semibold text-gray-800 mt-3">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-gray-500 text-xs">Edit your profile</p>
          </div>

          {/* FORM */}
          <div className="space-y-3 text-sm">

            {/* First Name */}
            <div>
              <label className="font-medium text-gray-700">First Name</label>
              <input
                type="text"
                value={user.firstName}
                onChange={(e) =>
                  setUser({ ...user, firstName: e.target.value })
                }
                className="w-full p-2 border rounded-lg mt-1 text-sm"
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                value={user.lastName}
                onChange={(e) =>
                  setUser({ ...user, lastName: e.target.value })
                }
                className="w-full p-2 border rounded-lg mt-1 text-sm"
              />
            </div>

            {/* Department */}
            <div>
              <label className="font-medium text-gray-700">Department</label>
              <select
                value={user.department}
                onChange={handleDepartmentSelect}
                className="w-full p-2 border rounded-lg mt-1 text-sm"
              >
                <option value="">Select Department</option>
                {departmentList.map((d) => (
                  <option key={d._id} value={d.departmentName}>
                    {d.departmentName}
                  </option>
                ))}
              </select>
            </div>

            {/* Category - dynamic */}
            {categoryList.length > 0 && (
              <div>
                <label className="font-medium text-gray-700">Category</label>
                <select
                  value={user.category}
                  onChange={(e) =>
                    setUser({ ...user, category: e.target.value })
                  }
                  className="w-full p-2 border rounded-lg mt-1 text-sm"
                >
                  <option value="">Select Category</option>
                  {categoryList.map((cat, idx) => (
                    <option key={idx} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Password */}
            <div className="relative">
              <label className="font-medium text-gray-700">New Password (Optional)</label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Leave blank to keep current"
                onChange={(e) =>
                  setUser({ ...user, password: e.target.value })
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

          {/* SAVE BUTTON */}
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

export default UserProfile;
