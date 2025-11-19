import React from "react";
import { X, Trash2, AlertTriangle } from "lucide-react";

const DeleteDepartmentModal = ({ isOpen, onClose, onConfirm, departmentName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-2xl w-[380px] animate-scaleIn border border-gray-300 dark:border-gray-700 relative">

        {/* Close Btn */}
        <button
          className="absolute top-3 right-3 hover:bg-gray-200 dark:hover:bg-gray-700 p-1.5 rounded-full transition"
          onClick={onClose}
        >
          <X size={18} className="text-gray-700 dark:text-gray-300" />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center text-center gap-3">
          <div className="bg-red-100 dark:bg-red-900 p-3 rounded-full">
            <AlertTriangle size={28} className="text-red-600 dark:text-red-300" />
          </div>

          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            Delete Department?
          </h2>

          <p className="text-sm text-gray-600 dark:text-gray-400">
            Are you sure you want to delete  
            <span className="font-bold text-red-600 dark:text-red-300"> {departmentName} </span>?  
            This action cannot be undone.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="w-full py-2 rounded-lg font-medium bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 transition"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="w-full py-2 rounded-lg font-medium bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-2 transition"
          >
            <Trash2 size={18} /> Delete
          </button>
        </div>

      </div>
    </div>
  );
};

export default DeleteDepartmentModal;
