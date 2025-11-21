import React from "react";
import { Info, User, Calendar, XCircle, CheckCircle, Clock } from "lucide-react";

const RequestCard = ({ data = {}, onViewDetails, onAssign }) => {
  const requester = data?.requestedBy;

  const fullName = requester
    ? `${requester.firstName || ""} ${requester.lastName || ""}`
    : "Unknown Requester";

  const taskType = data?.taskType || "No Task Provided";
  const department = data?.department || "No Department";
  const status = data?.status || "Pending";

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
    <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all duration-200">

      {/* Name + Icon */}
      <div className="flex items-center gap-3 mb-3">
        <div className="bg-blue-100 p-3 rounded-full">
          <User size={20} className="text-blue-600" />
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 text-lg">{fullName}</h3>
          <p className="text-xs text-gray-500">{department}</p>
        </div>
      </div>

      {/* Task */}
      <p className="text-gray-700 text-sm mb-1">
        <span className="font-medium">Task:</span> {taskType}
      </p>

      {/* Request Date */}
      <p className="flex items-center gap-2 text-gray-600 text-sm mt-1">
        <Calendar size={14} className="text-blue-500" />
        <span className="font-medium">{formattedDate}</span>
      </p>

      {/* Request Status */}
      <span
        className={`px-3 py-1 mt-2 inline-block rounded-full text-xs font-semibold
          ${
            status === "Approved"
              ? "bg-green-100 text-green-700"
              : status === "Noted"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-gray-200 text-gray-700"
          }
        `}
      >
        {status}
      </span>

      {/* --- Assigned Status Display (below status) --- */}
      <div className="mt-3">
        {assignedStatus === "Pending" && (
          <div className="flex items-center gap-2 text-sm text-yellow-700 bg-yellow-100 border border-yellow-200 rounded-lg px-3 py-2">
            <Clock size={16} className="text-yellow-700" />
            Pending Assignment
          </div>
        )}

        {assignedStatus === "Accepted" && (
          <div className="flex items-center gap-2 text-sm text-green-700 bg-green-100 border border-green-200 rounded-lg px-3 py-2">
            <CheckCircle size={16} className="text-green-700" />
            Task Accepted
          </div>
        )}

        {assignedStatus === "Rejected" && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-3 py-3 mt-2">
            <div className="flex items-center gap-2 text-red-700 text-sm font-medium">
              <XCircle size={16} />
              Task Rejected
            </div>

            {/* Reject Reason */}
            {rejectReason && (
              <p className="text-xs text-red-600 mt-1">
                Reason: <span className="font-semibold">{rejectReason}</span>
              </p>
            )}
          </div>
        )}
      </div>

      {/* View Details */}
      <button
        onClick={onViewDetails}
        className="w-full mt-4 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition"
      >
        <Info size={18} /> View Details
      </button>

      {/* Assign / Reassign Button */}
{data.status === "Approved" &&
  data.notedBy &&
  data.approvedBy &&
  data.assignedStatus !== "Accepted" && (   // <-- HIDE when Accepted
    <button
      onClick={onAssign}
      className={`w-full mt-2 flex items-center justify-center gap-2 
        ${
          data.assignedStatus === "Rejected"
            ? "bg-red-600 hover:bg-red-700"
            : "bg-green-600 hover:bg-green-700"
        }
        text-white py-2 rounded-lg text-sm font-medium transition`}
    >
      {data.assignedStatus === "Rejected" ? "Re-Assign Task" : "Assign Task"}
    </button>
  )}
    </div>
  );
};

export default RequestCard;
