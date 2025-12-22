import React, { useState } from "react";
import { ClipboardList, FilePlus, Eye, LogOut, LayoutDashboard, Menu, X , UserRoundMinus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const StaffHeader = ({ name = "Staff" }) => {
  const [openMenu, setOpenMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const userCategories = JSON.parse(
  localStorage.getItem("userCategories") || "[]"
);

const isTeacher = userCategories.some((cat) =>
  /^teacher(s)?$/i.test(cat)
);

  return (
    <div className="w-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-md border border-gray-700/60 px-6 py-3 text-white">

      {/* Top Bar */}
      <div className="flex justify-between items-center mb-3">

        <div className="flex items-center">
          <img src="/sfcg.png" alt="" className="w-12 h-12 object-contain" />

          <div className="px-2 leading-tight">
            <motion.h1
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-sm font-bold tracking-wide bg-gradient-to-r from-orange-900 via-orange-700 to-orange-500 bg-clip-text text-transparent"
            >
              SFCG NOI TASK
            </motion.h1>

            <h1 className="text-lg font-semibold leading-tight">
              Welcome, <span className="text-amber-400">{name}</span> 👋
            </h1>

            <p className="text-xs text-gray-300 hidden sm:block">
              Manage tasks and requests efficiently.
            </p>
          </div>
        </div>

        {/* Desktop Logout */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={handleLogout}
          className="hidden sm:flex items-center gap-2 bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-full text-white text-xs font-semibold shadow transition"
        >
          <LogOut size={16} /> Logout
        </motion.button>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setOpenMenu(!openMenu)}
          className="sm:hidden p-2 bg-white/10 rounded-lg hover:bg-white/20"
        >
          {openMenu ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Desktop Menu */}
      <div className="hidden sm:grid grid-cols-4 gap-3">
        <ActionCard iconBg="bg-purple-500" icon={<LayoutDashboard size={18} />} link="/staffdashboard" text="Dashboard" />
        { isTeacher && (
          <ActionCard iconBg="bg-amber-500" icon={<ClipboardList size={18} />} link="/todowork" text="To-Do Work" />
        )}
        <ActionCard iconBg="bg-green-500" icon={<Eye size={18} />} link="/userRequest" text="View Request" />
        <ActionCard iconBg="bg-blue-500" icon={<UserRoundMinus size={18} />} link="/user/profile" text="Profile" />

      </div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {openMenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="sm:hidden grid grid-cols-1 gap-3 mt-2"
          >
            <ActionCard iconBg="bg-purple-500" icon={<LayoutDashboard size={18} />} link="/staffdashboard" text="Dashboard" full />
            <ActionCard iconBg="bg-amber-500" icon={<ClipboardList size={18} />} link="/todowork" text="To-Do Work" full />
            <ActionCard iconBg="bg-green-500" icon={<Eye size={18} />} link="/staff/userRequest" text="View Request" full />
            <ActionCard iconBg="bg-blue-500" icon={<UserRoundMinus size={18} />} link="/user/profile  " text="Profile" full />

            <motion.div
              whileHover={{ scale: 1.05 }}
              onClick={handleLogout}
              className="flex items-center gap-3 p-3 bg-gray-800/60 rounded-lg border border-gray-700 hover:border-red-500 transition cursor-pointer"
            >
              <span className="p-2 bg-red-600 text-black rounded-md">
                <LogOut size={18} />
              </span>
              <span className="text-sm font-semibold">Logout</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StaffHeader;

/* Action Card Component */
const ActionCard = ({ icon, text, link, iconBg }) => (
  <motion.div
    whileHover={{ scale: 1.03 }}
    className="flex items-center gap-3 p-3 bg-gray-800/60 rounded-lg border border-gray-700 hover:border-gray-400 cursor-pointer transition"
  >
    <span className={`py-1.5 px-2 ${iconBg} text-black rounded-md`}>{icon}</span>
    <Link to={link} className="text-sm font-medium">{text}</Link>
  </motion.div>
);
