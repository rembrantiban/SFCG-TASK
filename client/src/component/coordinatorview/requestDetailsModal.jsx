import React from "react";
import { X, ClipboardList, Clock, CalendarDays } from "lucide-react";
import axiosInstance from "../../lib/axios";
import { toast } from "react-hot-toast";

const RequestDetailsModal = ({ request, onClose, refreshData }) => {
  const fullName = request?.requestedBy
    ? `${request.requestedBy.firstName} ${request.requestedBy.lastName}`
    : "Unknown Requester";

  const formatDate = (date) => {
    if (!date) return "Not set";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // --- MARK AS NOTED HANDLER ---
  const handleMarkAsNoted = async () => {
    try {
      const res = await axiosInstance.put(`/request/noted/${request._id}`);
      if (res.data.success) {
        toast.success("Marked as Noted");
        refreshData();
        onClose();
      }
    } catch (err) {
      toast.error("Failed to update request");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl p-6 relative">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-900"
        >
          <X size={22} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <ClipboardList size={26} className="text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900">Request Details</h2>
        </div>

        {/* Content */}
        <div className="space-y-3 text-gray-800">
          <p><strong>Requested By:</strong> {fullName}</p>
          <p><strong>Department:</strong> {request.requestedBy.department}</p>
          <p><strong>Category:</strong> {request.category}</p>

          <p className="flex items-center gap-2">
            <CalendarDays size={16} className="text-blue-600" />
            <strong>Requested Date:</strong> {formatDate(request.requestedDate)}
          </p>

          <p className="flex items-center gap-2">
            <Clock size={16} className="text-blue-600" />
            <strong>Urgency:</strong> {request.urgency}
          </p>

          <p><strong>Status:</strong> {request.status}</p>

          <div className="bg-gray-100 p-3 rounded-lg">
            <strong>Details:</strong>
            <p className="text-gray-700 mt-1 leading-relaxed">
              {request.requestDetails || "No details provided."}
            </p>
          </div>

          {/* Approved & Noted Section */}
          <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3 rounded-lg">

            {/* Approved Info */}
            <div>
              <strong>Approved By:</strong>
              <p className="text-blue-700 mt-1">
                {request?.approvedBy
                  ? `${request.approvedBy.firstName} ${request.approvedBy.lastName}`
                  : "Not approved yet"}
              </p>

              <strong className="block mt-2">Approved Date:</strong>
              <p className="text-gray-600">{formatDate(request.approvedDate)}</p>
            </div>

            {/* Noted Info */}
            <div>
              <strong>Noted By:</strong>
              <p className="text-green-700 mt-1">
                {request?.notedBy
                  ? `${request.notedBy.firstName} ${request.notedBy.lastName}`
                  : "Not noted yet"}
              </p>

              <strong className="block mt-2">Noted Date:</strong>
              <p className="text-gray-600">{formatDate(request.notedDate)}</p>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-between items-center gap-3">

          {/* Mark as Noted Button */}
          {request.status === "Pending" && (
            <button
              onClick={handleMarkAsNoted}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Mark as Noted
            </button>
          )}

          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-900 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequestDetailsModal;
