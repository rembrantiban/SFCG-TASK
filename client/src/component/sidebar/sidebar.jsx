import React, { useState } from "react";
import {
  LayoutDashboard,
  Users,
  BriefcaseBusiness,
  ClipboardList,
  ListChecks,
  Archive,
  Send,
  ChevronRight,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "../../lib/axios";
import toast from "react-hot-toast";

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const [taskOpen, setTaskOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={18} />, path: "/dashboard" },
    { name: "User Management", icon: <Users size={18} />, path: "/user" },
    { name: "Department Management", icon: <BriefcaseBusiness size={18} />, path: "/role" },
  ];

  const taskItems = [
    { name: "Task List", path: "/assignpage", icon: <ListChecks size={17} /> },
    { name: "View Task Requests", path: "/allrequest", icon: <Send size={17} /> },
  ];

  const recordItems = [
    { name: "Record", path: "/record", icon: <Archive size={17} /> },
  ];

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
      localStorage.removeItem("token");
      navigate("/");
      toast.success("Logout Successfully");
    } catch (err) {
      console.error("Logout failed:", err);
      toast.error("Internal Server Error");
    }
  };

  // Task Dropdown Only
  const renderDropdown = (isOpen, setIsOpen, title, icon, items) => (
    <>
      <motion.li
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.02 }}
        className={`flex items-center gap-4 py-3 px-5 cursor-pointer rounded-xl transition-all text-sm font-medium 
          ${isOpen ? "bg-gray-600 text-gray-100 shadow-md" : "hover:bg-gray-700"}
        `}
      >
        {icon}
        {open && <span>{title}</span>}
        {open && (
          <ChevronRight
            className={`ml-auto transition-transform ${isOpen ? "rotate-90" : ""}`}
            size={18}
          />
        )}
      </motion.li>

      <AnimatePresence>
        {isOpen && open && (
          <motion.ul
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="ml-10 space-y-2 overflow-hidden"
          >
            {items.map((item, idx) => {
              const isActive = location.pathname === item.path;
              return (
                <Link key={idx} to={item.path}>
                  <motion.li
                    whileHover={{ scale: 1.05, x: 5 }}
                    className={`flex items-center gap-3 py-2 px-3 text-sm rounded-lg transition-all 
                      ${isActive ? "bg-gray-600 text-gray-100 shadow-md" : "hover:bg-gray-700"}
                    `}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </motion.li>
                </Link>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </>
  );

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden fixed top-4 left-4 z-50 bg-gray-800 text-white p-2 rounded-lg shadow-lg"
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>

      <motion.div
        animate={{ width: open ? 260 : 80 }}
        transition={{ duration: 0.25 }}
        className="h-screen bg-gradient-to-b from-gray-900 to-gray-700 text-white shadow-xl fixed top-0 left-0 z-40"
      >
        <div className="flex flex-col items-center gap-3 p-5 border-b border-gray-600">
          <motion.img
            animate={{ rotate: open ? 0 : 360 }}
            transition={{ duration: 0.5 }}
            src="/sfcg.png"
            alt="Logo"
            className="w-16 h-15 rounded-full border border-white shadow-md"
          />
          {open && (
            <h1 className="text-lg font-bold bg-gradient-to-r from-orange-900 via-orange-800 to-orange-500 bg-clip-text text-transparent">
              SFCG NOI TASK
            </h1>
          )}
        </div>

        <ul className="mt-4 space-y-2">

          {/* MAIN ITEMS */}
          {menuItems.map((menu, index) => {
            const isActive = location.pathname === menu.path;
            return (
              <Link key={index} to={menu.path}>
                <motion.li
                  whileHover={{ scale: 1.03 }}
                  className={`flex items-center gap-4 py-3 px-5 rounded-xl text-sm font-medium transition-all 
                    ${isActive ? "bg-gray-600 text-gray-100 shadow-md" : "hover:bg-gray-700"}`}
                >
                  {menu.icon}
                  {open && <span>{menu.name}</span>}
                </motion.li>
              </Link>
            );
          })}

          {/* TASK DROPDOWN ONLY */}
          {renderDropdown(taskOpen, setTaskOpen, "Task Management", <ClipboardList size={18} />, taskItems)}

          {/* RECORD ITEMS — NOT A DROPDOWN */}
          {recordItems.map((rec, i) => {
            const isActive = location.pathname === rec.path;
            return (
              <Link key={i} to={rec.path}>
                <motion.li
                  whileHover={{ scale: 1.03 }}
                  className={`flex items-center gap-4 py-3 px-5 rounded-xl text-sm font-medium transition-all 
                    ${isActive ? "bg-gray-600 text-gray-100 shadow-md" : "hover:bg-gray-700"}`}
                >
                  {rec.icon}
                  {open && <span>{rec.name}</span>}
                </motion.li>
              </Link>
            );
          })}

        </ul>

        {/* Logout */}
        <div className="absolute bottom-6 w-full px-5">
          <motion.button
            whileHover={{ scale: 1.03 }}
            onClick={handleLogout}
            className="flex items-center gap-3 py-2 px-10 w-full bg-red-500 hover:bg-red-600 rounded-lg text-white text-sm font-medium"
          >
            <LogOut size={18} />
            {open && "Logout"}
          </motion.button>
        </div>
      </motion.div>
    </>
  );
}
