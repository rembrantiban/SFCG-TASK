import React from "react";
import { X, ClipboardList, Clock, CheckCircle2 } from "lucide-react";
import axiosInstance from "../../lib/axios";
import { toast } from "react-hot-toast";

const RequestDetailsModal = ({ request, onClose, refreshData }) => {
  if (!request) return null;

  const fullName = request?.requestedBy
    ? `${request.requestedBy.firstName} ${request.requestedBy.lastName}`
    : "Unknown Requester";

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleApproved = async () => {
    try {
      const res = await axiosInstance.put(`/request/markAsApproved/${request._id}`);
      if (res.data.success) {
        toast.success("Marked as Approved");
        onClose();
        if (refreshData) refreshData();
      }
    } catch (err) {
      toast.error("Failed to mark as approved");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl p-6 relative animate-fadeIn">

        {/* Close */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-900"
        >
          <X size={22} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <ClipboardList className="text-blue-600" size={28} />
          <h2 className="text-xl font-bold text-gray-900">Request Details</h2>
        </div>

        {/* Info Items */}
        <div className="space-y-3 text-gray-800">
          <p><strong>Requested By:</strong> {fullName}</p>
          <p><strong>Department:</strong> {request.department}</p>
          <p><strong>Category:</strong> {request.category}</p>

          {request.otherCategory && (
            <p><strong>Other Category:</strong> {request.otherCategory}</p>
          )}

          <p className="flex items-center gap-2">
            <Clock size={16} className="text-blue-600" />
            <strong>Urgency:</strong> {request.urgency}
          </p>

          <p><strong>Status:</strong> {request.status || "Pending"}</p>
          <p><strong>Requested Date:</strong> {formatDate(request.requestedDate)}</p>

          <div className="bg-gray-100 p-3 rounded-lg mt-3">
            <strong>Details:</strong>
            <p className="text-gray-700 mt-1 leading-relaxed">
              {request.requestDetails || "No details provided."}
            </p>
          </div>

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

          
        {/* Footer Buttons */}
        <div className="mt-6 flex justify-end gap-3">

          {/* Approve Button */}
          <button
            onClick={handleApproved}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 transition"
          >
            <CheckCircle2 size={18} /> Approve
          </button>

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
