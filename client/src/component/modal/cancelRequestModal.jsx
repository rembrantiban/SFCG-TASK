import React from "react";
import { XCircle } from "lucide-react";

const CancelRequestModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <XCircle className="text-red-600" /> Cancel Request
        </h2>

        <p className="text-gray-700 mt-3">
          Are you sure you want to cancel this request? This action cannot be
          undone.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-800"
          >
            No
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
          >
            Yes, Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelRequestModal;
