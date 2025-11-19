import React from "react";
import { Users, ClipboardList, Send, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const StatsCards = ({ totalUsers, totalTasks, totalRequest, totalAssigned }) => {
  const stats = [
    {
      title: "Total Users",
      value: totalUsers || 0,
      icon: <Users className="w-6 h-6 text-blue-400" />,
      bg: "bg-blue-900/40",
      dot: "bg-blue-400"
    },
    {
      title: "No. of Tasks",
      value: totalTasks || 0,
      icon: <ClipboardList className="w-6 h-6 text-yellow-400" />,
      bg: "bg-yellow-900/40",
      dot: "bg-yellow-400"
    },
    {
      title: "Task Requests",
      value: totalRequest || 0,
      icon: <Send className="w-6 h-6 text-purple-400" />,
      bg: "bg-purple-900/40",
      dot: "bg-purple-400"
    },
    {
      title: "Assigned Tasks",
      value: totalAssigned || 0,
      icon: <CheckCircle className="w-6 h-6 text-green-400" />,
      bg: "bg-green-900/40",
      dot: "bg-green-400"
    },
  ];

  return (
    <motion.div 
    initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mt-5">
      {stats.map((item, index) => (
        <div
          key={index}
          className={`flex items-center justify-between p-5 rounded-xl ${item.bg} border border-white/10 backdrop-blur-md shadow-lg hover:scale-[1.02] transition-transform duration-300`}
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`w-2.5 h-2.5 rounded-full ${item.dot}`}></span>
              <p className="text-gray-200 text-xs uppercase tracking-wide font-medium">
                {item.title}
              </p>
            </div>
            <h2 className="text-3xl font-bold text-white">{item.value}</h2>
          </div>

          <div className="p-3 bg-black/20 rounded-lg border border-white/10">
            {item.icon}
          </div>
        </div>
      ))}
    </motion.div>
  );
};

export default StatsCards;
