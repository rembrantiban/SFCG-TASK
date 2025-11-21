/* FULL UPDATED CODE WITH:
   - TIMELINE
   - PROGRESS BAR
   - MODER UI & ANIMATION
   - CONFIRM COMPLETED
   - AUTO REFRESH
   - ACTIVITY LOGS
*/

import React, { useEffect, useState } from "react";
import axiosInstance from "../lib/axios";
import StaffHeader from "../component/staffheader/header";
import {
  ClipboardList,
  CalendarDays,
  User,
  FileText,
  XCircle,
  CheckCircle,
  Activity,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const TodoWorks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Reject modal
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  // Complete confirmation modal
  const [completeModalOpen, setCompleteModalOpen] = useState(false);
  const [selectedCompleteTaskId, setSelectedCompleteTaskId] = useState(null);

  const userId = localStorage.getItem("userId");
  const firstName = localStorage.getItem("userFirstName") || "Staff";

  useEffect(() => {
    if (!userId) return;
    loadTasks();

    // Auto refresh every 10 seconds
    const interval = setInterval(() => {
      loadTasks(false); 
    }, 10000);

    return () => clearInterval(interval);
  }, [userId]);

  const loadTasks = async (showLoader = true) => {
    if (showLoader) setLoading(true);

    try {
      const res = await axiosInstance.get(`/assign/usertasks/${userId}`);
      if (res.data.success) setTasks(res.data.tasks);
    } catch (err) {
      console.error("❌ Failed to load tasks:", err);
    } finally {
      if (showLoader) setLoading(false);
    }
  };

  // UPDATE STATUS
  const updateStatus = async (taskId, newStatus) => {
    try {
      const res = await axiosInstance.put(`/assign/status/${taskId}`, {
        status: newStatus,
      });
      if (res.data.success) {
        toast.success(`Status updated to ${newStatus}`);
        loadTasks(false);
      }
    } catch (err) {
      toast.error("Failed to update status");
      console.log(err.response?.data);
    }
  };

  // Accept Task
  const handleAccept = async (taskId) => {
    try {
      const res = await axiosInstance.put(`/assign/accept/${taskId}`);
      if (res.data.success) {
        toast.success("Task accepted!");
        loadTasks(false);
      }
    } catch (err) {
      toast.error("Failed to accept task");
    }
  };

  // Reject Task
  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast.error("Please enter a reason");
      return;
    }

    try {
      const res = await axiosInstance.put(`/assign/reject/${selectedTaskId}`, {
        rejectReason,
      });
      if (res.data.success) {
        toast.success("Task rejected!");
        setRejectModalOpen(false);
        setRejectReason("");
        loadTasks(false);
      }
    } catch (err) {
      toast.error("Failed to reject task");
    }
  };

  // PROGRESS PERCENT
  const getProgressPercent = (task) => {
    if (task.status === "Completed") return 100;
    if (task.status === "In Progress") return 60;
    return 30; // Pending
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-40 text-gray-600 text-lg">
        Loading tasks...
      </div>
    );

  return (
    <div>
      <StaffHeader name={firstName} />

      {/* REJECT MODAL */}
      <AnimatePresence>
        {rejectModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <h2 className="text-lg font-bold flex items-center gap-2 mb-3">
                <XCircle className="text-red-600" /> Reject Task
              </h2>

              <textarea
                className="w-full border rounded-lg p-3 text-sm"
                rows="4"
                placeholder="Enter reason..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />

              <div className="flex justify-end gap-2 mt-3">
                <button
                  className="px-4 py-2 bg-gray-200 rounded-lg"
                  onClick={() => setRejectModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded-lg"
                  onClick={handleReject}
                >
                  Submit
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* COMPLETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {completeModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-xl max-w-md w-full shadow-lg"
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.85 }}
            >
              <h3 className="text-lg font-bold flex items-center gap-2 mb-2">
                <CheckCircle className="text-green-600" /> Mark as Completed
              </h3>

              <p className="text-sm text-gray-700 mb-4">
                Are you sure you want to mark this task as{" "}
                <span className="font-semibold text-green-700">Completed</span>?
              </p>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setCompleteModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 rounded-lg"
                >
                  Cancel
                </button>

                <button
                  onClick={async () => {
                    await updateStatus(selectedCompleteTaskId, "Completed");
                    setCompleteModalOpen(false);
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT */}
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-3 flex items-center gap-2">
          <ClipboardList /> My Assigned Tasks
        </h1>

        {tasks.length === 0 ? (
          <p className="text-center py-10 text-gray-600">No tasks yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {tasks.map((task) => {
              const progress = getProgressPercent(task);
              return (
                <motion.div
                  key={task._id}
                  className="bg-white p-5 rounded-xl shadow border border-gray-200 hover:shadow-lg transition-all"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  layout
                >
                  {/* HEADER */}
                  <div className="flex justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">
                        {task.requestId?.taskType}
                      </h2>
                      <p className="text-sm text-gray-500">
                        {task.requestId?.category}
                      </p>

                      <p className="mt-1 text-sm flex items-center gap-1">
                        <User size={14} />
                        <span className="font-medium">
                          {task.requestId?.requestedBy?.firstName}{" "}
                          {task.requestId?.requestedBy?.lastName}
                        </span>
                      </p>
                    </div>

                    <span
                      className={`px-3 py-1 text-xs rounded-full font-semibold ${
                        task.assignedStatus === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : task.assignedStatus === "Accepted"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {task.assignedStatus}
                    </span>
                  </div>

                  {/* PROGRESS BAR */}
                  <div className="mt-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Progress</span>
                      <span>{progress}%</span>
                    </div>

                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-2 bg-gradient-to-r from-blue-500 to-green-500 transition-all"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>

                    <div className="flex justify-between text-[11px] text-gray-500 mt-1">
                      <span className={progress >= 30 ? "text-blue-600 font-semibold" : ""}>
                        Assigned
                      </span>
                      <span className={progress >= 60 ? "text-blue-600 font-semibold" : ""}>
                        In Progress
                      </span>
                      <span className={progress >= 100 ? "text-green-600 font-semibold" : ""}>
                        Completed
                      </span>
                    </div>
                  </div>

                  {/* DETAILS */}
                  <div className="bg-gray-100 p-3 rounded-lg mt-4">
                    <p className="font-semibold text-sm flex items-center gap-2">
                      <FileText size={16} /> Task Details
                    </p>
                    <p className="text-gray-600 text-sm mt-1">
                      {task.requestId?.requestDetails}
                    </p>
                  </div>

                  {/* ACTION BUTTONS */}
                  {task.assignedStatus === "Pending" ? (
                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={() => handleAccept(task._id)}
                        className="flex-1 bg-green-600 text-white py-2 rounded-lg flex items-center justify-center gap-2"
                      >
                        <CheckCircle size={16} /> Accept
                      </button>
                      <button
                        onClick={() => {
                          setSelectedTaskId(task._id);
                          setRejectModalOpen(true);
                        }}
                        className="flex-1 bg-red-600 text-white py-2 rounded-lg flex items-center justify-center gap-2"
                      >
                        <XCircle size={16} /> Reject
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-3 mt-4">
                      {/* Pending */}
                      <button
                        disabled={task.status === "Pending" || task.status === "Completed"}
                        onClick={() => updateStatus(task._id, "Pending")}
                        className={`flex-1 py-2 rounded-lg border text-xs ${
                          task.status === "Pending"
                            ? "bg-yellow-500 text-white border-yellow-600"
                            : "text-yellow-600 border-yellow-400"
                        }`}
                      >
                        Pending
                      </button>

                      {/* In Progress */}
                      <button
                        disabled={task.status === "In Progress" || task.status === "Completed"}
                        onClick={() => updateStatus(task._id, "In Progress")}
                        className={`flex-1 py-2 rounded-lg border text-xs ${
                          task.status === "In Progress"
                            ? "bg-blue-600 text-white border-blue-700"
                            : "text-blue-700 border-blue-400"
                        }`}
                      >
                        In Progress
                      </button>

                      {/* Completed */}
                      <button
                        disabled={task.status === "Completed"}
                        onClick={() => {
                          setSelectedCompleteTaskId(task._id);
                          setCompleteModalOpen(true);
                        }}
                        className={`flex-1 py-2 rounded-lg border text-xs ${
                          task.status === "Completed"
                            ? "bg-green-600 text-white border-green-700"
                            : "text-green-600 border-green-400"
                        }`}
                      >
                        Completed
                      </button>
                    </div>
                  )}

                  {/* ACTIVITY LOG */}
                  <div className="mt-4 border-t pt-3 text-xs text-gray-600">
                    <p className="flex items-center gap-1 font-semibold">
                      <Activity size={14} /> Activity Log
                    </p>

                    <p>• Assigned: <strong>{new Date(task.createdAt).toLocaleString()}</strong></p>

                    {task.startDate && (
                      <p>• Started: <strong>{new Date(task.startDate).toLocaleString()}</strong></p>
                    )}

                    {task.endDate && (
                      <p>• Completed: <strong>{new Date(task.endDate).toLocaleString()}</strong></p>
                    )}

                    <p>• Status: <strong>{task.status}</strong></p>

                    <p className="flex items-center gap-1 mt-1">
                      <User size={12} /> Assigned by:{" "}
                      <strong>
                        {task.createdBy?.firstName} {task.createdBy?.lastName}
                      </strong>
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoWorks;
