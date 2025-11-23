import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import axiosInstance from "../lib/axios";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import SfcBackground from "../assets/sfcgBackgorund.jpg";

export function RegisterForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    idNumber: "",
    department: "",
    category: "",
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

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const res = await axiosInstance.get("/department/getalldepartment");
        setDepartmentList(res.data.departments || []);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };
    loadDepartments();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // username always lowercase, no spaces
    if (name === "userName") {
      return setFormData((prev) => ({
        ...prev,
        userName: value.toLowerCase().replace(/\s+/g, ""),
      }));
    }

    setFormData((prev) => ({ ...prev, [name]: value.trimStart() }));
  };

  // VALIDATIONS
  const idFormat = /^\d{3}-\d{4}$/;
  const idValid = idFormat.test(formData.idNumber);

  const usernameFormat = /^[a-z0-9._-]{3,20}$/;
  const usernameValid = usernameFormat.test(formData.userName);

  const passwordValid = formData.password.length >= 10;

  const canSubmit =
    formData.firstName &&
    formData.lastName &&
    usernameValid &&
    idValid &&
    formData.department &&
    formData.category &&
    passwordValid &&
    formData.password === formData.confirmPassword &&
    agreeTerms &&
    !loading;

  // SUBMIT HANDLER
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!usernameValid) {
      toast.error("❌ Username must be 3–20 characters, lowercase, no spaces");
      setLoading(false);
      return;
    }

    if (!idValid) {
      toast.error("❌ Invalid ID (use format 000-0000)");
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
        userName: formData.userName.trim(),
        idNumber: formData.idNumber.trim(),
        department: formData.department,
        category: formData.category,
        password: formData.password,
      };

      const res = await axiosInstance.post("/auth/register", body, { withCredentials: true });

      if (res.data.success) {
        toast.success("🎉 Registration Successful!");
        navigate("/");
      } else {
        toast.error(res.data.message);
      }

    } catch (error) {
      toast.error(error?.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="w-screen min-h-screen flex items-center justify-center px-4 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.85)), url(${SfcBackground})`,
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-xl max-h-[92vh] overflow-y-hidden bg-white/10 backdrop-blur-3xl border border-white/20 shadow-2xl rounded-3xl p-8"
      >
        {/* HEADER */}
        <div className="text-center mb-8">
          <img src="/sfcg.png" className="w-20 mx-auto drop-shadow-xl" />
          <h2 className="text-3xl font-extrabold text-white mt-4">Create Account</h2>
          <p className="text-gray-200 text-sm mt-1">Join the SFCG Staff Task System</p>
        </div>

        {/* FORM */}
        <form className="space-y-4" onSubmit={handleRegister}>
          
          {/* Row 1 */}
          <div className="grid grid-cols-2 gap-3">
            <InputSmall label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} />
            <InputSmall label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} />
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-2 gap-3">
            <InputSmall
              label="Username"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              notice={!usernameValid && formData.userName ? "Invalid username" : ""}
            />
            <InputSmall
              label="ID Number (000-0000)"
              name="idNumber"
              value={formData.idNumber}
              onChange={handleChange}
              notice={!idValid && formData.idNumber ? "Invalid ID format" : ""}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <DropdownSmall
              label="Department"
              name="department"
              value={formData.department}
              onChange={(e) => {
                handleChange(e);
                const selected = departmentList.find((d) => d.departmentName === e.target.value);
                setCategoryList(selected?.categories || []);
                setFormData((prev) => ({ ...prev, category: "" }));
              }}
              options={departmentList.map((d) => d.departmentName)}
            />

            {categoryList.length > 0 && (
              <DropdownSmall
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                options={categoryList}
              />
            )}
          </div>

          {/* Row 4 */}
          <div className="grid grid-cols-2 gap-3">
            <PasswordSmall
              label="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              show={showPassword}
              toggle={() => setShowPassword(!showPassword)}
            />
            <PasswordSmall
              label="Confirm Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              show={showConfirmPassword}
              toggle={() => setShowConfirmPassword(!showConfirmPassword)}
            />
          </div>

          {!passwordValid && formData.password && (
            <p className="text-xs text-red-300">Password must be at least 10 characters</p>
          )}

          <div className="flex items-center gap-2 mt-2">
            <input type="checkbox" onChange={(e) => setAgreeTerms(e.target.checked)} />
            <span className="text-white text-sm">I agree to the Terms & Conditions</span>
          </div>

          <button
            disabled={!canSubmit}
            className={`w-full py-2 rounded-lg font-semibold text-white text-base shadow-lg transition-all ${
              canSubmit ? "bg-blue-700 hover:bg-blue-800" : "bg-gray-600 cursor-not-allowed"
            }`}
          >
            {loading ? "Creating Account..." : "Register"}
          </button>

        </form>

        <p className="text-center text-gray-200 text-sm mt-6 pb-2">
          Already have an account?{" "}
          <Link to="/" className="text-yellow-300 hover:underline font-semibold">
            Sign In
          </Link>
        </p>

      </motion.div>
    </div>
  );
}

/* ------------------------ HELPER INPUT COMPONENTS ------------------------ */

function InputSmall({ label, name, value, onChange, notice }) {
  return (
    <div>
      <label className="text-xs text-white font-medium">{label}</label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        className="w-full mt-1 px-3 py-1.5 rounded-md bg-white/5 text-white 
                   border border-white/30 focus:ring-2 focus:ring-blue-400 
                   outline-none text-sm placeholder-gray-300"
      />
      {notice && <p className="text-xs text-red-300 mt-1">{notice}</p>}
    </div>
  );
}

function DropdownSmall({ label, name, value, onChange, options }) {
  return (
    <div>
      <label className="text-xs text-white font-medium">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full mt-1 px-3 py-1.5 rounded-md bg-white/5 text-white 
                   border border-white/30 outline-none focus:ring-2 
                   focus:ring-blue-400 text-sm"
      >
        <option value="">Select {label}</option>
        {options.map((opt, idx) => (
          <option key={idx} className="text-black">{opt}</option>
        ))}
      </select>
    </div>
  );
}

function PasswordSmall({ label, name, value, onChange, show, toggle }) {
  return (
    <div>
      <label className="text-xs text-white font-medium">{label}</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full mt-1 px-3 py-1.5 rounded-md bg-white/5 text-white 
                     border border-white/30 outline-none focus:ring-2 focus:ring-blue-400 
                     pr-10 text-sm"
        />
        <button type="button" onClick={toggle} className="absolute right-3 top-2 text-gray-300">
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}

export default RegisterForm;
