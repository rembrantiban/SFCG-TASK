import React, { useEffect, useState } from "react";
import axiosInstance from "../../lib/axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

// Custom tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-lg px-3 py-2 text-xs">
        <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1">{label}</p>

        {payload
          .filter((item) => item.dataKey !== "tasks") // 👈 REMOVE TASKS FROM TOOLTIP
          .map((item) => (
            <div key={item.dataKey} className="flex justify-between text-gray-600 dark:text-gray-400">
              <span className="capitalize">{item.dataKey}</span>
              <span className="font-semibold text-gray-900 dark:text-white">{item.value}</span>
            </div>
        ))}
      </div>
    );
  }
  return null;
};

const MetricsBarChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await axiosInstance.get("/assign/weekly-metrics");
        if (res.data.success) {
          setData(res.data.metrics);
        }
      } catch (err) {
        console.error("❌ Failed to load metrics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl">
        <p className="text-gray-600 dark:text-gray-300">Loading chart...</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl">

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 tracking-wide">
          📌 Task Activity Overview
        </h2>
        <span className="text-xs px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border border-blue-300/40">
          Updated Weekly
        </span>
      </div>

      <ResponsiveContainer width="100%" height={330}>
        <BarChart data={data} barCategoryGap="18%">
          <CartesianGrid strokeDasharray="4 4" strokeOpacity={0.15} />
          <XAxis dataKey="name" tick={{ fill: "#6b7280", fontSize: 12 }} />
          <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />


          <Bar dataKey="users" fill="#0ea5e9" radius={[12, 12, 0, 0]} />
          <Bar dataKey="requests" fill="#c084fc" radius={[12, 12, 0, 0]} />
          <Bar dataKey="assign" fill="#22c55e" radius={[12, 12, 0, 0]} />

        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MetricsBarChart;
