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
  Building2,
  Tags,
  User,
} from "lucide-react";
import { toast } from "react-hot-toast";

const UpdateUserModal = ({ userData, onUpdateSuccess }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [departmentList, setDepartmentList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    department: "",
    category: "",
    password: "",
  });

  /* LOAD DEPARTMENTS */
  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const res = await axiosInstance.get("/department/getalldepartment");
        setDepartmentList(res.data.departments || []);
      } catch (err) {
        console.error("Failed to load departments", err);
      }
    };
    loadDepartments();
  }, []);

  /* LOAD USER DATA */
  useEffect(() => {
    if (userData) {
      setForm({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        userName: userData.userName || "",
        department: userData.department || "",
        category: userData.category || "",
        password: "",
      });

      const selectedDept = departmentList.find(
        (d) => d.departmentName === userData.department
      );
      setCategoryList(selectedDept?.categories || []);
    }
  }, [userData, departmentList]);

  /* HANDLE INPUT CHANGE */
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "userName") {
      return setForm((prev) => ({
        ...prev,
        userName: value.toLowerCase().replace(/\s+/g, ""),
      }));
    }

    setForm({ ...form, [name]: value });
  };

  /* DEPARTMENT CHANGE */
  const handleDepartmentSelect = (e) => {
    const value = e.target.value;

    setForm((prev) => ({ ...prev, department: value, category: "" }));

    const selected = departmentList.find((d) => d.departmentName === value);
    setCategoryList(selected?.categories || []);
  };

  /* SUBMIT UPDATE */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const body = {
        firstName: form.firstName,
        lastName: form.lastName,
        userName: form.userName,
        department: form.department,
        category: form.category,
      };

      if (form.password.trim() !== "") {
        body.password = form.password;
      }

      const res = await axiosInstance.put(`/auth/update/${userData._id}`, body);

      toast.success("User updated successfully!");
      onUpdateSuccess(res.data.user);
      setIsOpen(false);
    } catch (error) {
      console.error("Update failed", error);
      toast.error(error?.response?.data?.message || "Error updating user");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* OPEN BUTTON */}
      <button
        onClick={() => setIsOpen(true)}
        className="px-3 py-1.5 rounded-lg flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium"
      >
        <Edit3 size={18} /> Edit
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-6 w-[480px] shadow-xl relative">
            
            {/* CLOSE BUTTON */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
              <X size={22} />
            </button>

            <h2 className="text-xl font-semibold text-center mb-4">
              Update User Information
            </h2>

            {/* PROFILE */}
            <div className="flex justify-center mb-5">
              <img
                src={Profile}
                alt="Profile"
                className="w-20 h-20 rounded-full border-4 border-blue-500 shadow-md"
              />
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-3">

              {/* NAME ROW */}
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="First Name"
                  icon={<UserCircle2 />}
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                />
                <Input
                  label="Last Name"
                  icon={<UserCircle2 />}
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                />
              </div>

              {/* USERNAME + DEPARTMENT */}
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Username"
                  icon={<User />}
                  name="userName"
                  value={form.userName}
                  onChange={handleChange}
                />

                <Select
                  label="Department"
                  icon={<Building2 />}
                  name="department"
                  value={form.department}
                  onChange={handleDepartmentSelect}
                  options={departmentList.map((d) => d.departmentName)}
                />
              </div>

              {/* CATEGORY + PASSWORD */}
              <div className="grid grid-cols-2 gap-3">
                <Select
                  label="Category"
                  icon={<Tags />}
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  options={categoryList}
                />

                <PasswordInput
                  label="New Password (optional)"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  show={showPassword}
                  toggle={() => setShowPassword(!showPassword)}
                />
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-full py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center justify-center gap-2"
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

/* INPUT WITH LABEL */
const Input = ({ label, icon, ...props }) => (
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-700 mb-1">{label}</label>
    <div className="relative">
      <span className="absolute left-3 top-3 text-gray-500">{icon}</span>
      <input
        {...props}
        className="w-full pl-10 pr-3 py-2 border rounded-lg bg-gray-50"
      />
    </div>
  </div>
);

/* SELECT WITH LABEL */
const Select = ({ label, icon, options, ...props }) => (
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-700 mb-1">{label}</label>
    <div className="relative">
      <span className="absolute left-3 top-3 text-gray-500">{icon}</span>
      <select
        {...props}
        className="w-full pl-10 pr-3 py-2 border rounded-lg bg-gray-50"
      >
        <option value="">Select {label}</option>
        {options.map((opt, i) => (
          <option key={i} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  </div>
);

/* PASSWORD WITH LABEL */
const PasswordInput = ({ label, show, toggle, ...props }) => (
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-700 mb-1">{label}</label>
    <div className="relative">
      <input
        {...props}
        type={show ? "text" : "password"}
        className="w-full pl-3 pr-10 py-2 border rounded-lg bg-gray-50"
      />
      <button
        type="button"
        onClick={toggle}
        className="absolute right-3 top-2.5 text-gray-600"
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  </div>
);

export default UpdateUserModal;
