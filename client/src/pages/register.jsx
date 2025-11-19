import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import axiosInstance from "../lib/axios";
import { Eye, EyeOff } from "lucide-react";

export function RegisterForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    idNumber: "",
    department: "",
    category: "",     // NEW FIELD
    password: "",
    confirmPassword: "",
  });

  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [departmentList, setDepartmentList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);

  const navigate = useNavigate();

  // Fetch all departments on page load
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await axiosInstance.get("/department/getalldepartment");
        setDepartmentList(res.data.departments);
      } catch (error) {
        console.error("Failed to load departments:", error);
      }
    };

    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value.trimStart(),
    }));
  };

  const idNumberRegex = /^\d{3}-\d{4}$/;
  const isIdValid = idNumberRegex.test(formData.idNumber);
  const isPasswordValid = formData.password.length >= 10;

  const canSubmit =
    formData.firstName &&
    formData.lastName &&
    formData.idNumber &&
    formData.department &&
    formData.category &&     // NEW REQUIRED FIELD
    formData.password &&
    formData.confirmPassword &&
    agreeTerms &&
    isPasswordValid &&
    isIdValid &&
    !loading;

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!isIdValid) {
      toast.error("❌ ID Format must be 000-0000");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("❌ Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const body = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        idNumber: formData.idNumber.trim(),
        department: formData.department.trim(),
        category: formData.category.trim(),    // ADD CATEGORY TO BODY
        password: formData.password.trim(),
      };

      const res = await axiosInstance.post("/auth/register", body, {
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success("🎉 Registration successful!");
        navigate("/");
      } else {
        toast.error(res.data.message || "Registration failed");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-gray-800 to-black px-6 py-10">
      <div className="w-full max-w-lg bg-white/20 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/30">

        {/* Logo + Title */}
        <div className="flex flex-col items-center text-center mb-8">
          <img src="/sfcg.png" alt="Logo" className="w-20 mb-3 drop-shadow-lg" />
          <h3 className="text-3xl font-extrabold text-white tracking-wide">
            Create Your Account
          </h3>
          <p className="text-gray-200 text-sm mt-1">
            Fill in your details to get started
          </p>
        </div>

        {/* FORM */}
        <form className="space-y-5" onSubmit={handleRegister}>

          {/* First + Last Name */}
          <div className="grid grid-cols-2 gap-4">
            <Input label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} />
            <Input label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} />
          </div>

          {/* ID NUMBER */}
          <Input
            label="ID Number (000-0000)"
            name="idNumber"
            value={formData.idNumber}
            onChange={handleChange}
            notice={!isIdValid && formData.idNumber.length > 0 ? "Format must be 000-0000" : ""}
          />

          {/* DEPARTMENT */}
          <div>
            <label className="text-sm font-medium text-white">Department</label>
            <select
              name="department"
              value={formData.department}
              onChange={(e) => {
                handleChange(e);

                const selected = departmentList.find(
                  (dept) => dept.departmentName === e.target.value
                );

                // Populate categories for selected department
                setCategoryList(selected?.categories || []);
                setFormData((prev) => ({ ...prev, category: "" })); // reset category
              }}
              className="w-full mt-1 px-3 py-2 rounded-md bg-white/90 text-black focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Select Department</option>
              {departmentList.map((dept) => (
                <option key={dept._id} value={dept.departmentName}>
                  {dept.departmentName}
                </option>
              ))}
            </select>
          </div>

          {/* CATEGORY (Shows only when department selected) */}
          {categoryList.length > 0 && (
            <div>
              <label className="text-sm font-medium text-white">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 rounded-md bg-white/90 text-black focus:ring-2 focus:ring-blue-500 outline-none"
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

          {/* PASSWORD */}
          <PasswordInput
            label="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            show={showPassword}
            toggle={() => setShowPassword(!showPassword)}
          />
          {!isPasswordValid && formData.password.length > 0 && (
            <p className="text-xs text-red-300">Must be at least 10 characters</p>
          )}

          {/* CONFIRM PASSWORD */}
          <PasswordInput
            label="Confirm Password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            show={showConfirmPassword}
            toggle={() => setShowConfirmPassword(!showConfirmPassword)}
          />

          {/* TERMS */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm text-white">
              I agree to the terms & conditions
            </span>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={!canSubmit}
            className={`w-full py-2 rounded-lg text-white font-semibold tracking-wide transition-all ${
              canSubmit
                ? "bg-blue-700 hover:bg-blue-800 shadow-lg"
                : "bg-gray-500 cursor-not-allowed"
            }`}
          >
            {loading ? "Registering..." : "Sign Up"}
          </button>
        </form>

        {/* FOOTER LINK */}
        <p className="text-center text-gray-200 text-sm mt-6">
          Already have an account?{" "}
          <Link to="/" className="text-yellow-300 hover:underline font-semibold">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

/* --- REUSABLE COMPONENTS --- */

function Input({ label, name, type = "text", value, onChange, notice }) {
  return (
    <div>
      <label className="text-sm font-medium text-white">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full mt-1 px-3 py-2 rounded-md bg-white/90 text-black focus:ring-2 focus:ring-blue-500 outline-none"
      />
      {notice && <p className="text-xs text-red-300 mt-1">{notice}</p>}
    </div>
  );
}

function PasswordInput({ label, name, value, onChange, show, toggle }) {
  return (
    <div>
      <label className="text-sm font-medium text-white">{label}</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full mt-1 px-3 py-2 rounded-md bg-white/90 text-black focus:ring-2 focus:ring-blue-500 outline-none pr-10"
        />
        <button
          type="button"
          onClick={toggle}
          className="absolute right-3 top-2.5 text-gray-700 hover:text-black"
        >
          {show ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
    </div>
  );
}

export default RegisterForm;
