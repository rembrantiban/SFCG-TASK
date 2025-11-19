import React, { useState, useEffect } from "react";
import axiosInstance from "../../lib/axios";
import { Eye, EyeOff, X, User, Building, Hash, Lock } from "lucide-react";
import { toast } from "react-hot-toast";

const RegisterModal = ({ isOpen, onClose, onSuccess }) => {

  /* -----------------------------
      ALL HOOKS MUST BE HERE
  ------------------------------ */
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    idNumber: "",
    department: "",
    category: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agree, setAgree] = useState(false);

  const [departmentList, setDepartmentList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);

  const idRegex = /^\d{3}-\d{4}$/;
  const isIdValid = idRegex.test(formData.idNumber);

  /* fetch departments ONCE */
  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const res = await axiosInstance.get("/department/getalldepartment");
        setDepartmentList(res.data.departments || []);
      } catch (err) {
        console.error(err);
      }
    };
    loadDepartments();
  }, []);

  /* -----------------------------
      EARLY RETURN CAN BE HERE
      (AFTER hooks, BEFORE JSX)
  ------------------------------ */
  if (!isOpen) return null;

  /* -----------------------------
      HANDLERS
  ------------------------------ */
  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleDepartmentSelect = (e) => {
    const value = e.target.value;

    setFormData(prev => ({ ...prev, department: value, category: "" }));

    const selected = departmentList.find(
      d => d.departmentName === value
    );

    setCategoryList(selected?.categories || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!agree) return toast.error("You must accept the terms.");
    if (!isIdValid) return toast.error("ID must be 000-0000 format.");
    if (formData.password !== formData.confirmPassword)
      return toast.error("Passwords do not match.");

    setLoading(true);

    try {
      const body = {
        ...formData,
        role: "Staff"
      };

      const res = await axiosInstance.post("/auth/register", body);

      if (res.data.success) {
        toast.success("Account created!");
        onSuccess?.(res.data.user);
        onClose();
      } else {
        toast.error(res.data.message || "Registration failed");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  /* -----------------------------
      JSX STARTS HERE
  ------------------------------ */
  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg relative">
        
        {/* Close button */}
        <button onClick={onClose} className="absolute right-4 top-4">
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold text-center mb-4">Add Account</h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* First + Last Name */}
          <div className="grid grid-cols-2 gap-3">
            <Input icon={<User />} name="firstName" placeholder="First Name" onChange={handleChange} />
            <Input icon={<User />} name="lastName" placeholder="Last Name" onChange={handleChange} />
          </div>

          {/* ID Number */}
          <Input icon={<Hash />} name="idNumber" placeholder="000-0000" value={formData.idNumber} onChange={handleChange} />
          {!isIdValid && formData.idNumber && <p className="text-xs text-red-500">Invalid ID format</p>}

          {/* Department */}
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-500"><Building size={18} /></span>
            <select
              name="department"
              value={formData.department}
              onChange={handleDepartmentSelect}
              className="pl-10 py-2 w-full border rounded"
            >
              <option value="">Select Department</option>
              {departmentList.map(dept => (
                <option key={dept._id} value={dept.departmentName}>{dept.departmentName}</option>
              ))}
            </select>
          </div>

          {/* Category */}
          {categoryList.length > 0 && (
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border rounded py-2"
            >
              <option value="">Select Category</option>
              {categoryList.map((cat, idx) => (
                <option key={idx} value={cat}>{cat}</option>
              ))}
            </select>
          )}

          {/* Password */}
          <PasswordInput {...{
            name: "password",
            placeholder: "Password",
            value: formData.password,
            onChange: handleChange,
            show: showPassword,
            toggle: () => setShowPassword(!showPassword)
          }} />

          {/* Confirm Password */}
          <PasswordInput {...{
            name: "confirmPassword",
            placeholder: "Confirm Password",
            value: formData.confirmPassword,
            onChange: handleChange,
            show: showConfirm,
            toggle: () => setShowConfirm(!showConfirm)
          }} />

          {/* Terms */}
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={agree} onChange={() => setAgree(!agree)} />
            I agree to the Terms & Conditions
          </label>

          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded">
            {loading ? "Creating..." : "Create Account"}
          </button>

        </form>

      </div>
    </div>
  );
};

/* Reusable Components */
const Input = ({ icon, ...props }) => (
  <div className="relative">
    <span className="absolute left-3 top-3 text-gray-500">{icon}</span>
    <input {...props} className="w-full pl-10 py-2 border rounded" />
  </div>
);

const PasswordInput = ({ show, toggle, ...props }) => (
  <div className="relative">
    <Lock className="absolute left-3 top-3 text-gray-500" size={18} />
    <input
      type={show ? "text" : "password"}
      {...props}
      className="w-full pl-10 pr-10 py-2 border rounded"
    />
    <button type="button" onClick={toggle} className="absolute right-3 top-3">
      {show ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  </div>
);

export default RegisterModal;
