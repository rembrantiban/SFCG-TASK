import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../../lib/axios";
import { LogIn, User, X, Eye, EyeOff } from "lucide-react";
import { toast } from "react-hot-toast";

export function Login() {
  const [openModal, setOpenModal] = useState(false);
  const [idNumber, setIdNumber] = useState("");
  const [password, setPassword] = useState("");
  const [disableButton, setDisableButton] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const onCloseModal = () => {
    setOpenModal(false);
    setIdNumber("");
    setPassword("");
    setDisableButton(true);
    setLoading(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axiosInstance.post("/auth/login", { idNumber, password });

      if (res.data.success) {
        const { id, firstName, lastName, role, department } = res.data.user;

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userId", id);
        localStorage.setItem("userFirstName", firstName);
        localStorage.setItem("userLastName", lastName);
        localStorage.setItem("userRole", role);
        localStorage.setItem("userDepart", department);

        toast.success("Login successful!");

        onCloseModal();

        if (role === "Admin") navigate("/dashboard");
        else if (role === "College President") navigate("/request/taskpresident");
        else if (role === "Task Coordinator") navigate("/request/taskcoordinator");
        else navigate("/staffdashboard");
      } else {
        toast.error(res.data.message || "Login failed");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* OPEN LOGIN BUTTON */}
      <button
        className="bg-gradient-to-r from-teal-600 to-teal-800 hover:brightness-110 px-6 py-2.5 rounded-full 
        font-semibold text-white flex items-center gap-2 shadow-lg transition-all"
        onClick={() => setOpenModal(true)}
      >
        <User size={20} />
        Sign in
      </button>

      {/* LOGIN MODAL */}
      {openModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50  
        backdrop-blur-sm z-50 px-4 animate-fadeIn">

          <div className="bg-white/40 backdrop-blur-xl rounded-2xl w-full max-w-md shadow-2xl 
          p-7 relative border border-white/30">

            {/* CLOSE BUTTON */}
            <button
              onClick={onCloseModal}
              className="absolute top-4 right-4 text-gray-700 hover:text-black transition"
            >
              <X size={22} />
            </button>

            {/* LOGO + TITLE */}
            <div className="flex flex-col items-center mb-6">
              <img src="/sfcg.png" className="w-20 h-20 drop-shadow-lg" />
              <h3 className="text-2xl font-bold text-gray-900 mt-2">Welcome Back</h3>
              <p className="text-sm text-gray-700">Please sign in to continue</p>
            </div>

            {/* LOGIN FORM */}
            <form className="space-y-4" onSubmit={handleLogin}>

              {/* ID NUMBER */}
              <div>
                <label className="text-sm font-medium text-gray-900">ID Number</label>
                <input
                  type="text"
                  placeholder="000-0000"
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  required
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-white/70 text-gray-900
                  border border-gray-300 focus:ring-2 focus:ring-teal-600 outline-none"
                />
              </div>

              {/* PASSWORD INPUT + TOGGLE */}
              <div>
                <label className="text-sm font-medium text-gray-900">Password</label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-white/70 text-gray-900
                    border border-gray-300 focus:ring-2 focus:ring-teal-600 outline-none pr-10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-[36%] text-gray-600 hover:text-black transition"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* REMEMBER ME */}
              <div className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  onChange={(e) => setDisableButton(!e.target.checked)}
                  className="w-4 h-4 cursor-pointer"
                />
                <span className="text-gray-800">Remember me</span>
              </div>

              {/* LOGIN BUTTON */}
              <button
                type="submit"
                disabled={disableButton || loading}
                className={`w-full py-2 rounded-md text-white font-semibold shadow-md
                transition flex items-center justify-center gap-2
                ${
                  disableButton || loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-teal-700 hover:bg-teal-800"
                }`}
              >
                {loading ? "Logging in..." : <><LogIn size={18} /> Log in</>}
              </button>

              {/* REGISTER LINK */}
              <p className="text-center text-sm text-gray-700 mt-3">
                Don’t have an account?{" "}
                <Link to="/register" className="text-teal-700 font-semibold hover:underline">
                  Register
                </Link>
              </p>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Login;
