import React, { useEffect, useState } from "react";
import axiosInstance from "../../lib/axios";
import { toast } from "react-hot-toast";
import CancelRequestModal from "../modal/cancelRequestModal";

import {
  ClipboardList,
  Loader2,
  UserCheck,
  UserCircle,
} from "lucide-react";

const UserRequest = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [requestToCancel, setRequestToCancel] = useState(null);

const cancelRequest = async (requestId) => {
  try {
    await axiosInstance.delete(`/request/cancel/${requestId}`);
    toast.success("Request canceled successfully!");
    fetchMyRequests();
    setCancelModalOpen(false);
  } catch (error) {
    toast.error(error?.response?.data?.message || "Failed to cancel request.");
  }
};



  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const fetchMyRequests = async () => {
    try {
      const res = await axiosInstance.get("/request/my-requests");
      setRequests(res.data.data);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyRequests();
  }, []);

  const statusColor = {
    Pending: "bg-yellow-100 text-yellow-700 border-yellow-400",
    Noted: "bg-blue-100 text-blue-700 border-blue-400",
    Approved: "bg-green-100 text-green-700 border-green-400",
    Completed: "bg-purple-100 text-purple-700 border-purple-400",
    Rejected: "bg-red-100 text-red-700 border-red-400",
  };

  return (
    <div className="p-6 w-full max-w-7xl mx-auto">

      {/* PAGE HEADER */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-blue-100 shadow-sm">
            <ClipboardList size={28} className="text-blue-600" />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              My Work Order Requests
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              View all work orders you submitted and track their progress.
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-gray-600 text-lg">
          <Loader2 className="animate-spin" size={20} />
          Loading requests...
        </div>
      ) : requests.length === 0 ? (
        <p className="text-gray-500 italic text-center">
          No request history found.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {requests.map((req) => (
            <div
              key={req._id}
              className="bg-white/80 backdrop-blur rounded-2xl p-6 border border-gray-200 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              {req.status === "Pending" && (

                <button
                  onClick={() => {
                    setRequestToCancel(req);
                    setCancelModalOpen(true);
                  }}
                  className="w-full text-end mb-2 hover:text-red-400 text-red-500  text-sm font-medium transition"
                >
                  Cancel Request
                </button>
              )}

              {req.isReject && (
                <div className="mb-3 -mt-1 bg-red-100 text-red-700 border border-red-300 px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2">
                  <span className="text-red-600">⚠️</span>
                  Your Request Has Been Rejected
                </div>
              )}

               <p className="text-xs text-gray-500 mb-2">
                  📅 <strong>Request Date:</strong> {formatDate(req.requestedDate)}
                </p>

              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <ClipboardList size={20} className="text-blue-600" />
                {req.taskType}
              </h2>

              <p className="text-sm text-gray-700 mt-2">
                <strong>Category:</strong> {req.category}
                {req.otherCategory && (
                  <span className="text-gray-500"> ({req.otherCategory})</span>
                )}
              </p>

              <p className="text-sm text-gray-700 mt-1">
                <strong>Details:</strong> {req.requestDetails}
              </p>

              <p className="text-sm text-gray-700 mt-1">
                <strong>Urgency:</strong> {req.urgency}
              </p>

              <div className="my-4 border-t border-gray-300"></div>

              <div className="space-y-3">

                <div className="flex items-start gap-2">
                  <UserCheck size={18} className="text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-900">
                      <strong>Noted By:</strong>{" "}
                      {req.notedBy?.firstName
                        ? `${req.notedBy.firstName} ${req.notedBy.lastName}`
                        : "N/A"}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      📅 {formatDate(req.notedDate)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <UserCircle size={18} className="text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-900">
                      <strong>Approved By:</strong>{" "}
                      {req.approvedBy?.firstName
                        ? `${req.approvedBy.firstName} ${req.approvedBy.lastName}`
                        : "N/A"}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      📅 {formatDate(req.approvedDate)}
                    </p>
                  </div>
                </div>

              </div>

              {!req.isReject && (
                <span
                  className={`mt-4 inline-block px-4 py-1.5 text-xs font-bold rounded-full border shadow-sm
                 ${statusColor[req.status] || "bg-gray-200 text-gray-700 border-gray-400"}`}
                >
                  {req.status}
                </span>
              )}

            </div>
          ))}
        </div>
      )}
      <CancelRequestModal
      isOpen={cancelModalOpen}
      onClose={() => setCancelModalOpen(false)}
      onConfirm={() => cancelRequest(requestToCancel?._id)}
    />

    </div>
  );
};

export default UserRequest;
