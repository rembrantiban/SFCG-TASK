import React, { useEffect, useState } from "react";
import axiosInstance from "../lib/axios";
import Header from "../component/common/taskcoordinatorheader.jsx";
import {
  ClipboardList,
  User,
  Layers,
  Activity,
  Clock,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReassignModal from "../component/modal/ReassignModal"; // ✔ IMPORT

const AssignList = () => {
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedRequest, setSelectedRequest] = useState(null);

  // ✔ FIXED: Missing state
  const [isReassignModalOpen, setIsReassignModalOpen] = useState(false);

  const loadAssignedTasks = async () => {
    try {
      const res = await axiosInstance.get("/assign/assignlist");
      if (res.data.success) setAssignedTasks(res.data.assignedTasks);
    } catch (err) {
      console.error("Error fetching assigned tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssignedTasks();
  }, []);

  if (loading)
    return (
      <div className="w-full h-screen flex items-center justify-center text-gray-500 text-lg">
        Loading tasks...
      </div>
    );

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <Header />

      {/* ---- REQUEST DETAILS MODAL ---- */}
      <AnimatePresence>
        {selectedRequest && !isReassignModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[999]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white shadow-2xl rounded-2xl p-6 w-full max-w-lg relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
            >
              <button
                onClick={() => setSelectedRequest(null)}
                className="absolute top-4 right-4 p-2 bg-gray-200 hover:bg-gray-300 rounded-full"
              >
                <X size={18} />
              </button>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Request Details
              </h2>

              <div className="space-y-3 text-sm">
                <p><strong>Task Type:</strong> {selectedRequest.requestId?.taskType}</p>
                <p><strong>Category:</strong> {selectedRequest.requestId?.category}</p>
                <p><strong>Urgency:</strong> {selectedRequest.requestId?.urgency}</p>

                <p>
                  <strong>Requested By:</strong>{" "}
                  {selectedRequest.requestId?.requestedBy?.firstName}{" "}
                  {selectedRequest.requestId?.requestedBy?.lastName}
                </p>

                <p>
                  <strong>Assigned To:</strong>{" "}
                  {selectedRequest.assign?.firstName}{" "}
                  {selectedRequest.assign?.lastName}
                </p>

                <p>
                  <strong>Assigned By:</strong>{" "}
                  {selectedRequest.createdBy?.firstName}{" "}
                  {selectedRequest.createdBy?.lastName}
                </p>

                <p><strong>Description:</strong></p>
                <p className="p-3 bg-gray-100 rounded-lg text-gray-700">
                  {selectedRequest.requestId?.requestDetails}
                </p>

                <p>
                  <strong>Assigned On:</strong>{" "}
                  {new Date(selectedRequest.createdAt).toLocaleString()}
                </p>

                <p><strong>Work Status:</strong> {selectedRequest.status}</p>
                <p><strong>Assigned Status:</strong> {selectedRequest.assignedStatus}</p>

                {selectedRequest.assignedStatus === "Rejected" && (
                  <div className="mt-3">
                    <p className="font-semibold text-red-700">Reject Reason:</p>
                    <p className="p-3 bg-red-50 text-red-700 rounded-lg border border-red-200 mt-1">
                      {selectedRequest.rejectReason || "No reason provided."}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-5 flex justify-between">

                <button
                  onClick={() => setSelectedRequest(null)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* -------------- PAGE HEADER ---------------- */}
      <div className="p-6 max-w-7xl mx-auto">

        <div className="mb-6 bg-white/80 backdrop-blur rounded-2xl shadow-lg px-6 py-5 border border-gray-200">
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
            <span className="p-2 bg-blue-100 rounded-xl">
              <ClipboardList size={24} className="text-blue-600" />
            </span>
            Assigned Task Overview
          </h1>
          <p className="text-gray-500 mt-1 text-sm ml-1">
            View all tasks currently assigned to staff members.
          </p>
        </div>

        {/* ------------------- TASK CARDS ------------------- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {assignedTasks.map((a) => (
            <div
              key={a._id}
              className="bg-white shadow-md hover:shadow-xl transition-all rounded-2xl border border-gray-200 p-6 hover:-translate-y-1"
            >
              <h2 className="text-xl font-bold text-gray-900">
                {a.requestId?.taskType}
              </h2>

              <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                <Layers size={15} className="text-blue-600" />
                <span>{a.requestId?.category}</span>
              </div>

              <div className="my-4 border-t border-gray-200" />

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <User size={16} className="text-green-600" />
                  <span>
                    <strong>Assigned To:</strong>{" "}
                    {a.assign?.firstName} {a.assign?.lastName}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Activity size={16} className="text-blue-600" />
                  <span>
                    <strong>Assigned By:</strong>{" "}
                    {a.createdBy?.firstName} {a.createdBy?.lastName}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-purple-600" />
                  <span>
                    <strong>Date:</strong>{" "}
                    {new Date(a.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide
                    ${
                      a.assignedStatus === "Accepted"
                        ? "bg-green-100 text-green-700 border border-green-300"
                        : a.assignedStatus === "Rejected"
                        ? "bg-red-100 text-red-700 border border-red-300"
                        : "bg-yellow-100 text-yellow-700 border border-yellow-300"
                    }
                  `}
                >
                  {a.assignedStatus}
                </span>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide
                    ${
                      a.status === "Completed"
                        ? "bg-green-200 text-green-900"
                        : a.status === "In Progress"
                        ? "bg-blue-200 text-blue-900"
                        : "bg-gray-200 text-gray-800"
                    }
                  `}
                >
                  {a.status}
                </span>
              </div>

              {a.assignedStatus === "Rejected" && (
                <div className="bg-red-50 border border-red-300 text-red-700 p-3 rounded-lg text-xs mt-3">
                  <strong>Reject Reason:</strong>{" "}
                  {a.rejectReason || "No reason provided"}
                </div>
              )}

              <button
                onClick={() => setSelectedRequest(a)}
                className="mt-5 w-full py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
              >
                View Request Details
              </button>

              {a.assignedStatus === "Rejected" && (
                <button
                  onClick={() => {
                    setSelectedRequest(a);
                    setIsReassignModalOpen(true);
                  }}
                  className="mt-3 w-full py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                >
                  Reassign
                </button>
              )}
            </div>
          ))}
        </div>

        {assignedTasks.length === 0 && (
          <p className="text-center mt-10 text-gray-600 text-sm">
            No assigned tasks found.
          </p>
        )}
      </div>

      <ReassignModal
      isOpen={isReassignModalOpen}
      request={selectedRequest}
      onClose={() => {
        setIsReassignModalOpen(false);
        setSelectedRequest(null);  
      }}
      onReassigned={loadAssignedTasks}
    />

    </div>
  );
};

export default AssignList;
