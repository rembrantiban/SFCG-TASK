import React, { useEffect, useState } from "react";
import axiosInstance from "../../lib/axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

// Custom Tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-300 shadow-lg p-3 rounded-md text-xs">
        <p className="font-bold text-gray-800 mb-1">{label}</p>
        {payload
          .filter((item) => item.dataKey !== "tasks") // ⬅ REMOVE tasks
          .map((item) => (
            <p key={item.dataKey} className="capitalize text-gray-700">
              {item.dataKey}:{" "}
              <span className="font-semibold text-gray-900">{item.value}</span>
            </p>
          ))}
      </div>
    );
  }
  return null;
};

const MetricsLineChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Metrics
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await axiosInstance.get("/assign/weekly-metrics");
        if (res.data.success) {
          // Remove tasks key from data
          const cleaned = res.data.metrics.map((d) => {
            const { tasks, ...rest } = d;
            return rest;
          });
          setData(cleaned);
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
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
        <p className="text-gray-600">Loading chart...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold tracking-wide text-gray-900">
          📊 Weekly Metrics Overview
        </h2>
        <span className="text-xs px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
          Live Analytics
        </span>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" />

          <XAxis dataKey="name" stroke="#6b7280" tick={{ fill: "#4b5563", fontSize: 12 }} />
          <YAxis stroke="#6b7280" tick={{ fill: "#4b5563", fontSize: 12 }} />

          <Tooltip content={<CustomTooltip />} />

          {/* USERS LINE */}
          <Line type="monotone" dataKey="users" stroke="#0ea5e9" strokeWidth={3} dot={false} />

          {/* REQUESTS */}
          <Line type="monotone" dataKey="requests" stroke="#a855f7" strokeWidth={3} dot={false} />

          {/* ASSIGN */}
          <Line type="monotone" dataKey="assign" stroke="#22c55e" strokeWidth={3} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MetricsLineChart;
