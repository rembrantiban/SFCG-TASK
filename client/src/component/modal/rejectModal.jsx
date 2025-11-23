import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XCircle, X } from "lucide-react";

const RejectModal = ({ isOpen, onClose, onConfirm }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[999]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white w-full max-w-md p-6 rounded-2xl shadow-xl border border-gray-200 relative"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            {/* CLOSE BUTTON */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full"
            >
              <X size={18} />
            </button>

            <div className="flex flex-col items-center text-center">
              <XCircle size={50} className="text-red-600 mb-3" />

              <h2 className="text-xl font-bold text-gray-900">
                Reject This Request?
              </h2>

              <p className="text-gray-600 mt-2 text-sm">
                Are you sure you want to reject this staff request?
                <br />
                This action cannot be undone.
              </p>
            </div>

            {/* ACTIONS */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={onClose}
                className="w-1/2 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              <button
                onClick={onConfirm}
                className="w-1/2 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
              >
                Reject
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RejectModal;
