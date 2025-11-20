import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

import { ClipboardList, CheckCircle, Clock } from "lucide-react";

const StaffAnalytics = () => {
  const [taskStats, setTaskStats] = useState([]);
  const [monthlyChart, setMonthlyChart] = useState([]);

  useEffect(() => {
    loadSampleData();
  }, []);

  const loadSampleData = () => {
    setTaskStats([
      {
        label: "Assigned Tasks",
        value: 18,
        description: "Total tasks assigned to you",
        icon: <ClipboardList size={26} className="text-blue-600" />,
        color: "bg-blue-100",
      },
      {
        label: "Completed Tasks",
        value: 12,
        description: "Tasks successfully finished",
        icon: <CheckCircle size={26} className="text-green-600" />,
        color: "bg-green-100",
      },
      {
        label: "Pending Tasks",
        value: 6,
        description: "Tasks waiting to be done",
        icon: <Clock size={26} className="text-amber-600" />,
        color: "bg-amber-100",
      },
    ]);

    setMonthlyChart([
      { month: "Jan", assigned: 10, completed: 7 },
      { month: "Feb", assigned: 8, completed: 5 },
      { month: "Mar", assigned: 12, completed: 9 },
      { month: "Apr", assigned: 15, completed: 12 },
      { month: "May", assigned: 9, completed: 6 },
      { month: "Jun", assigned: 11, completed: 10 },
    ]);
  };

  return (
    <div className="w-full p-6 space-y-10">

     <div className="flex items-center gap-3">
      <span className="bg-blue-100 text-blue-600 p-2 rounded-xl">
        📊
      </span>
      <div>
        <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
          Staff Analytics Overview
        </h2>
        <p className="text-sm text-gray-500">
          A summary of your monthly performance and task activity.
        </p>
      </div>
    </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {taskStats.map((item, i) => (
          <div
            key={i}
            className="
              bg-white/90 backdrop-blur-xl 
              p-6 rounded-2xl shadow-sm border border-gray-200
              hover:shadow-xl hover:-translate-y-1 transition-all duration-300
            "
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.color} mb-4`}>
              {item.icon}
            </div>

            <p className="text-gray-600 text-sm font-medium">{item.label}</p>

            <h2 className="text-4xl font-extrabold text-gray-900 mt-2 tracking-tight">
              {item.value}
            </h2>

            <p className="text-gray-500 text-xs mt-1">{item.description}</p>
          </div>
        ))}
      </div>

     {/* --- CHARTS ROW (Line + Bar Side by Side) --- */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

  {/* --- Monthly Trend Line Chart --- */}
  <div className="p-6 rounded-2xl shadow-md bg-gradient-to-br from-white to-gray-50 border border-gray-200">
    <h3 className="text-lg font-semibold mb-4 text-gray-800">
      Monthly Tasks Trend
    </h3>

    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={monthlyChart}>
        <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" />
        <XAxis dataKey="month" stroke="#6b7280" tick={{ fontSize: 12 }} />
        <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} allowDecimals={false} />
        <Tooltip
          contentStyle={{
            background: "white",
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        />
        <Line
          type="monotone"
          dataKey="completed"
          stroke="#4f46e5"
          strokeWidth={3}
          dot={{ r: 5, strokeWidth: 2, fill: "white" }}
          activeDot={{ r: 7 }}
        />
        <Line
          type="monotone"
          dataKey="assigned"
          stroke="#22c55e"
          strokeWidth={3}
          dot={{ r: 5, strokeWidth: 2, fill: "white" }}
          activeDot={{ r: 7 }}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>

  {/* --- Workload Overview Bar Chart --- */}
  <div className="p-6 rounded-2xl shadow-md bg-gradient-to-br from-white to-gray-50 border border-gray-200">
    <h3 className="text-lg font-semibold mb-4 text-gray-800">
      Workload Overview
    </h3>

    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={taskStats}>
        <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" />
        <XAxis dataKey="label" stroke="#6b7280" tick={{ fontSize: 12 }} />
        <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} allowDecimals={false} />
        <Tooltip
          contentStyle={{
            background: "#ffffff",
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        />
        <Bar
          dataKey="value"
          fill="#fb923c"
          radius={[12, 12, 0, 0]}
          barSize={40}
        />
      </BarChart>
    </ResponsiveContainer>
  </div>

</div>

    </div>
  );
};

export default StaffAnalytics;
