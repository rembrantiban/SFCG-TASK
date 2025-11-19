import React from "react";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Header = ({ title, subtitle, showBack = false, actions }) => {
  const navigate = useNavigate();

  return (
    <motion.div
     
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="w-full mb-30"
    >
      <div className="
        fixed
        top-0
        w-7xl
        z-10
        flex items-center justify-between
        bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900
        backdrop-blur-lg shadow-xl px-6 py-4 
        border border-gray-700/70 rounded
      ">

        {/* Left Side (Title + Back Button) */}
        <div className="flex items-center gap-3">
          {showBack && (
            <motion.button
              onClick={() => navigate(-1)}
              whileHover={{ scale: 1.08, x: -2 }}
              whileTap={{ scale: 0.92 }}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition text-white"
            >
              <ChevronLeft size={18} />
            </motion.button>
          )}

          <motion.div
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >  {/* Add gradient title if desired */}
            {/* className="text-xl font-bold bg-gradient-to-r from-orange-400 to-yellow-500 bg-clip-text text-transparent tracking-wide" */}
            <h1 className="text-xl font-bold text-gray-100 tracking-wide">
              {title}
            </h1>

            {subtitle && (
              <p className="text-[13px] text-gray-300 mt-[2px]">{subtitle}</p>
            )}
          </motion.div>
        </div>

        {/* Right Side (Actions like profile / buttons) */}
        {actions && (
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: 6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35 }}
          >
            {actions}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Header;
