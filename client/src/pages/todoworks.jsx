import React, { useEffect, useState } from "react";
import axiosInstance from "../lib/axios";
import StaffHeader from "../component/staffheader/header";
import { ClipboardList, Clock, User } from "lucide-react";

const TodoWorks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) return;

    const fetchTasks = async () => {
      try {
        const res = await axiosInstance.get(`/assign/usertasks/${userId}`);
        if (res.data.success) {
          setTasks(res.data.tasks);
        }
      } catch (err) {
        console.error("❌ Failed to load tasks:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [userId]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-40 text-gray-600 text-lg">
        Loading tasks...
      </div>
    );

  return (
    <div>
      <StaffHeader />

      <div className="p-6 max-w-5xl mx-auto">
        {/* PAGE HEADER */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-2 text-gray-900">
            <ClipboardList size={28} className="text-blue-600" /> My Assigned Tasks
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Review your assigned tasks and monitor your progress.
          </p>
        </div>

        {/* EMPTY STATE */}
        {tasks.length === 0 ? (
          <div className="bg-white shadow-md rounded-xl p-6 text-center border">
            <p className="text-gray-700">You currently have no assigned tasks.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {tasks.map((task) => (
              <div
                key={task._id}
                className="bg-white border rounded-xl shadow-sm p-5 hover:shadow-md transition"
              >
                {/* Title + Status */}
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {task.requestId?.taskType || "Unnamed Task"}
                  </h2>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold 
                      ${
                        task.status === "In Progress"
                          ? "bg-blue-100 text-blue-700"
                          : task.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-700"
                      }`}
                  >
                    {task.status}
                  </span>
                </div>

                {/* Assigned By */}
                <p className="flex items-center gap-2 text-gray-700 text-sm mt-1">
                  <User size={16} className="text-gray-500" />
                  Assigned By:{" "}
                  <span className="font-medium">
                    {task.createdBy?.firstName} {task.createdBy?.lastName}
                  </span>
                </p>

                {/* Dates */}
                <div className="mt-3 space-y-1 text-gray-600 text-sm">
                  <p className="flex items-center gap-2">
                    <Clock size={16} className="text-blue-500" />
                    Start Date:{" "}
                    <span className="font-medium">
                      {task.startDate
                        ? new Date(task.startDate).toLocaleString()
                        : "Not set"}
                    </span>
                  </p>

                  <p className="flex items-center gap-2">
                    <Clock size={16} className="text-red-500" />
                    End Date:{" "}
                    <span className="font-medium">
                      {task.endDate
                        ? new Date(task.endDate).toLocaleString()
                        : "Not set"}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoWorks;
    