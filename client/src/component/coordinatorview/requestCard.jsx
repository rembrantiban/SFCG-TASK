import React from "react";
import {
  Info,
  User,
  Calendar,
  XCircle,
  CheckCircle,
  Clock,
} from "lucide-react";

const RequestCard = ({ data = {}, onViewDetails, onAssign, onReject }) => {
  const requester = data?.requestedBy;

  const fullName = requester
    ? `${requester.firstName || ""} ${requester.lastName || ""}`
    : "Unknown Requester";

  const taskType = data?.taskType || "No Task Provided";
  const department = data?.department || "No Department";
  const reqStatus = data?.status || "Pending";

  const assignedStatus = data?.assignedStatus || "Pending";
  const rejectReason = data?.rejectReason || "";

  const formattedDate = data?.requestedDate
    ? new Date(data.requestedDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "No Date Available";

  return (
    <div className="bg-white p-5 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">

      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-blue-100 p-3 rounded-full shadow-sm">
          <User size={22} className="text-blue-600" />
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 text-lg leading-tight">
            {fullName}
          </h3>
          <p className="text-xs text-gray-500">{department}</p>
        </div>
      </div>

      {/* Task */}
      <p className="text-gray-800 text-sm">
        <span className="font-medium text-gray-900">Task:</span> {taskType}
      </p>

      {/* Date */}
      <p className="flex items-center gap-2 text-gray-600 text-sm mt-2">
        <Calendar size={14} className="text-blue-500" />
        <span>{formattedDate}</span>
      </p>

      {/* Status */}
      <div className="mt-3">
        <span
          className={`px-3 py-1 inline-block rounded-full text-xs font-semibold border
            ${
              reqStatus === "Approved"
                ? "bg-green-100 text-green-700 border-green-300"
                : reqStatus === "Noted"
                ? "bg-yellow-100 text-yellow-700 border-yellow-300"
                : reqStatus === "Rejected"
                ? "bg-red-100 text-red-700 border-red-300"
                : "bg-gray-100 text-gray-600 border-gray-300"
            }
          `}
        >
          {reqStatus}
        </span>
      </div>

      {/* Assigned Status */}
      <div className="mt-4">
        {assignedStatus === "Pending" && (
          <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-xl px-3 py-2 text-sm text-yellow-700">
            <Clock size={16} />
            Waiting for staff response
          </div>
        )}

        {assignedStatus === "Accepted" && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-3 py-2 text-sm text-green-700">
            <CheckCircle size={16} />
            Task Accepted
          </div>
        )}

        {assignedStatus === "Rejected" && (
          <div className="bg-red-50 border border-red-300 rounded-xl px-3 py-3 mt-2">
            <div className="flex items-center gap-2 text-red-700 text-sm font-semibold">
              <XCircle size={16} />
              Task Rejected
            </div>

            {rejectReason && (
              <p className="text-xs text-red-600 mt-1">
                Reason: <span className="font-medium">{rejectReason}</span>
              </p>
            )}
          </div>
        )}
      </div>

      
<button
  onClick={data.isReject ? null : onViewDetails}
  disabled={data.isReject}
  className={`w-full mt-4 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition
    ${
      data.isReject
        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
        : "bg-blue-600 hover:bg-blue-700 text-white"
    }
  `}
>
  <Info size={18} /> View Details
</button>


      {data.status === "Approved" &&
        data.notedBy &&
        data.approvedBy &&
        assignedStatus !== "Accepted" && (
          <button
            onClick={onAssign}
            className={`w-full mt-2 flex items-center justify-center gap-2 text-white py-2 rounded-lg text-sm font-medium transition
              ${
                assignedStatus === "Rejected"
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-green-600 hover:bg-green-700"
              }
            `}
          >
            {assignedStatus === "Rejected" ? "Re-Assign Task" : "Assign Task"}
          </button>
        )}

    {data.isReject ? (
  <div className="w-full mt-2 flex items-center justify-center gap-2 
    bg-red-50 border border-red-200 text-red-700 py-2 rounded-lg 
    text-sm font-semibold">
    <XCircle size={18} />
    This request is rejected
  </div>
) : (
  reqStatus !== "Rejected" &&
  reqStatus !== "Noted" &&
  reqStatus !== "Approved" && (  
    <button
      onClick={onReject}
      className="w-full mt-2 flex items-center justify-center gap-2 
        bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg 
        text-sm font-medium transition"
    >
      <XCircle size={18} /> Reject Request
    </button>
  )
)}

    </div>
  );
};

export default RequestCard;
