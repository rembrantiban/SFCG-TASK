import React from "react";
import { Info, User, Calendar } from "lucide-react";

const RequestCard = ({ data = {}, onViewDetails, onAssign }) => {
  const requester = data?.requestedBy;
  const fullName = requester
    ? `${requester.firstName || ""} ${requester.lastName || ""}`
    : "Unknown Requester";

  const taskType = data?.taskType || "No Task Provided";
  const department = data?.department || "No Department";
  const status = data?.status || "Pending";

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
          <h3 className="font-semibold text-gray-900 text-lg">
            {fullName}
          </h3>
          <p className="text-xs text-gray-500">{department}</p>
        </div>
      </div>

      {/* Task */}
      <p className="text-gray-700 text-sm mb-1">
        <span className="font-medium">Task:</span> {taskType}
      </p>

      {/* Date */}
      <p className="flex items-center gap-2 text-gray-600 text-sm mt-1">
        <Calendar size={14} className="text-blue-500" />
        <span className="font-medium">{formattedDate}</span>
      </p>

      {/* Status Badge */}
      <span
        className={`px-3 py-1 mt-2 inline-block rounded-full text-xs font-semibold
          ${
            status === "Pending"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-gray-200 text-gray-700"
          }`}
      >
        {status}
      </span>

      {/* View Button */}
      <button
        onClick={onViewDetails}
        className="w-full mt-4 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition"
      >
        <Info size={18} /> View Details
      </button>

      {/* Assign Button */}
      {data?.markAsApproved && (
          <button
            onClick={onAssign}
            className="w-full mt-2 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-medium transition"
          >
            Assign Task
          </button>
        )}
    </div>
  );
};

export default RequestCard;
