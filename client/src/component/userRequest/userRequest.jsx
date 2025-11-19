import React, { useEffect, useState } from "react";
import axiosInstance from "../../lib/axios";
import { toast } from "react-hot-toast";

import { ClipboardList, Loader2, UserCheck, UserCircle } from "lucide-react";

const UserRequest = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🟦 FORMAT DATE FUNCTION
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
    Pending: "bg-yellow-500/20 text-yellow-600 border-yellow-500",
    Noted: "bg-blue-500/20 text-blue-600 border-blue-500",
    Approved: "bg-green-500/20 text-green-600 border-green-500",
    Completed: "bg-purple-500/20 text-purple-600 border-purple-500",
    Rejected: "bg-red-500/20 text-red-600 border-red-500",
  };

  return (
    <div className="p-6">
      <div className="flex flex-col mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-100">
            <ClipboardList size={22} className="text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            My Work Order Requests
          </h2>
        </div>

        <p className="text-sm text-gray-600 mt-1">
          View the work order requests you have submitted along with their status
          and approvers.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-gray-600">
          <Loader2 className="animate-spin" size={18} /> Loading...
        </div>
      ) : requests.length === 0 ? (
        <p className="text-gray-600 italic">No request records found.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {requests.map((req) => (
            <div
              key={req._id}
              className="p-5 rounded bg-gradient-to-r from-gray-100 via-gray-200 to-gray-200 shadow-2xl hover:shadow-lg transition-all duration-300"
            >
              <h3 className="text-lg font-semibold text-gray-600 flex items-center gap-2">
                <ClipboardList size={18} className="text-blue-500" />{" "}
                {req.taskType}
              </h3>
              <p className="text-sm text-gray-900">
                <strong>Category:</strong> {req.category}
                {req.otherCategory && ` (${req.otherCategory})`}
              </p>

              <p className="text-sm text-gray-900 mt-1">
                <strong>Details:</strong> {req.requestDetails}
              </p>

              <p className="text-sm text-gray-900">
                <strong>Urgency:</strong> {req.urgency}
              </p>

              {/* Noted + Approved */}
              <div className="mt-3 border-t pt-3 space-y-2">

                <p className="text-sm flex gap-2 items-center text-gray-900">
                  <UserCheck size={16} className="text-blue-500" />
                  <strong>Noted By:</strong>{" "}
                  {req.notedBy?.firstName
                    ? `${req.notedBy.firstName} ${req.notedBy.lastName}`
                    : "N/A"}
                </p>

                <p className="text-sm text-gray-700 ml-6">
                  📅 <strong>Noted Date:</strong> {formatDate(req.notedDate)}
                </p>

                <p className="text-sm flex gap-2 items-center text-gray-900">
                  <UserCircle size={16} className="text-green-500" />
                  <strong>Approved By:</strong>{" "}
                  {req.approvedBy?.firstName
                    ? `${req.approvedBy.firstName} ${req.approvedBy.lastName}`
                    : "N/A"}
                </p>

                <p className="text-sm text-gray-700 ml-6">
                  📅 <strong>Approved Date:</strong>{" "}
                  {formatDate(req.approvedDate)}
                </p>
              </div>

              <span
                className={`inline-block mt-3 px-3 py-1 text-xs font-semibold rounded-full border 
                  ${
                    statusColor[req.status] ||
                    "bg-gray-200 text-gray-600 border-gray-400"
                  }`}
              >
                {req.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserRequest;
