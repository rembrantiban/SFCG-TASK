import React from "react";
import { ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, Tooltip } from "recharts";

const SkillsChart = () => {
  const radarData = [
    { metric: "Users", value: 80 },
    { metric: "Tasks", value: 90 },
    { metric: "Requests", value: 60 },
    { metric: "Assigned", value: 75 },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md">
      <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">
        Productivity Radar Metric
      </h2>
      <ResponsiveContainer width="100%" height={340}>
        <RadarChart data={radarData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="metric" stroke="#9ca3af" />
          <Tooltip />
          <Radar name="Performance" dataKey="value" stroke="#ef4444" fill="#ef4444" fillOpacity={0.5} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SkillsChart;
