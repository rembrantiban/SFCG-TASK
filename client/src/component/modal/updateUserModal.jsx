import React, { useState, useEffect } from "react";
import axiosInstance from "../../lib/axios";
import Profile from "../../assets/pic1.png";
import {
  Hash,
  UserCircle2,
  X,
  Edit3,
  UserPen,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "react-hot-toast";

const UpdateUserModal = ({ userData, onUpdateSuccess }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    idNumber: "",
    department: "",
    password: "",
  });

  useEffect(() => {
    if (userData) {
      setForm({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        idNumber: userData.idNumber || "",
        department: userData.department || "",
        password: "",
      });
    }
  }, [userData]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const body = {
        firstName: form.firstName,
        lastName: form.lastName,
        idNumber: form.idNumber,
        department: form.department,
      };

      if (form.password.trim() !== "") {
        body.password = form.password;
      }

      const res = await axiosInstance.put(`/auth/update/${userData._id}`, body);

      toast.success("User updated successfully!");

      onUpdateSuccess(res.data.updatedUser || { ...userData, ...body });

      setIsOpen(false);
    } catch (error) {
      console.error("Update failed", error);
      toast.error("Error updating user");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-3 py-1.5 rounded-lg flex justify-center items-center bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium"
      >
        <Edit3 size={20} />
        Edit
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-[450px] relative shadow-xl">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-300"
            >
              ✕
            </button>

            <h2 className="text-lg font-semibold mb-4 text-center text-gray-800 dark:text-gray-100">
              Update User
            </h2>

            {/* Avatar */}
            <div className="flex justify-center mb-4">
              <img
                src={Profile}
                alt="Profile"
                className="w-20 h-20 rounded-full border-4 border-blue-600 object-cover shadow-md"
              />
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">

              {/* First Name */}
              <div className="relative">
                <UserCircle2 size={18} className="absolute left-3 top-3 text-gray-500" />
                <input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700"
                  placeholder="First Name"
                  required
                />
              </div>

              {/* Last Name */}
              <div className="relative">
                <UserCircle2 size={18} className="absolute left-3 top-3 text-gray-500" />
                <input
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700"
                  placeholder="Last Name"
                  required
                />
              </div>

              {/* ID Number (disabled) */}
              <div className="relative">
                <Hash size={18} className="absolute left-3 top-3 text-gray-500" />
                <input
                  type="text"
                  name="idNumber"
                  value={form.idNumber}
                  disabled
                  className="w-full pl-9 pr-3 py-2 border rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                  placeholder="123-4567"
                />
              </div>

              {/* Department */}
              <select
                name="department"
                value={form.department}
                onChange={handleChange}
                required
                className="w-full pl-3 pr-3 py-2 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700"
              >
                <option value="">Select Department</option>
                <option value="Maintenance">Maintenance</option>
                <option value="IT Department">IT Department</option>
                <option value="Accounting">Accounting</option>
                <option value="Registrar">Registrar</option>
                <option value="Student Affairs">Student Affairs</option>
                <option value="Other">Other</option>
              </select>

              {/* Optional new password */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter new password (optional)"
                  className="w-full pl-3 pr-10 py-2 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-500"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Modal Buttons */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-full h-10 flex justify-center gap-2 py-3 bg-red-500 hover:bg-red-600 text-white  rounded-lg font-medium"
                >
                  <X size={18} /> Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-10 flex justify-center gap-2 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium"
                >
                  <UserPen size={18} />
                  {isLoading ? "Updating..." : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default UpdateUserModal;
