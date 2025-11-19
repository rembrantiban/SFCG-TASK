import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "../../lib/axios";

const WorkOrderRequestModal = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    taskType: "",
    category: "",
    otherCategory: "",
    requestDetails: "",
    urgency: "When Possible",
  });

  const userId = localStorage.getItem("userId");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.taskType  || !formData.category || !formData.requestDetails) {
      return toast.error("Please fill in all required fields.");
    }

    const payload = {
      ...formData,
      requestedBy: userId,
    };

    try {
      setLoading(true);
      await axiosInstance.post("/request/create", payload, { withCredentials: true });
      window.location.reload()
      toast.success("Request submitted successfully!");

      setFormData({
        taskType: "",
        category: "",
        otherCategory: "",
        requestDetails: "",
        urgency: "When Possible",
      });

      onClose();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Submission failed.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;


  const user = {
    firstName: localStorage.getItem("userFirstName") || "",
    lastName: localStorage.getItem("userLastName") || "",
    role: localStorage.getItem("userRole") || "",
    depart: localStorage.getItem("userDepart") || "",
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white w-full max-w-2xl rounded-xl shadow-lg p-6 overflow-y-auto max-h-[90vh] relative"
        >
          <button onClick={onClose} className="absolute right-4 top-4 text-gray-600 hover:text-black">
            <X size={22} />
          </button>

          <div className="text-center mb-5">
            <h2 className="font-bold text-lg">Saint Francis College Guihulngan, Inc.</h2>
            <p className="text-xs text-gray-500">Negros Oriental, Philippines</p>
            <h3 className="font-semibold text-sm mt-1 uppercase">Work Order Request Form</h3>
          </div>


          <div className="space-y-1 mb-4 text-sm">
            <div>
              <strong>Date:</strong>{" "}
              <span>{new Date().toLocaleDateString()}</span>
            </div>

            <div>
              <strong>Name:</strong>{" "}
              <span>{user.firstName} {user.lastName}</span>
            </div>

            <div>
              <strong>Department:</strong>{" "}
              <span>{user.depart || "N/A"}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-sm">

            {/* Task Type */}
            <div>
              <label className="font-semibold text-gray-700">Task Type *</label>
              <input
                className="input-modern"
                value={formData.taskType}
                placeholder="Ex: Repair, Replacement, Installation"
                onChange={(e) => setFormData({ ...formData, taskType: e.target.value })}
              />
            </div>

            {/* Category */}
            <div>
              <label className="font-semibold text-gray-700">Category *</label>
              <select
                className="input-modern"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="" key="default-category-option">Select Category</option>
                {["Carpentry", "Electrical", "Painting", "Plumbing", "Others"].map((cat) => (
                  <option key={`cat-${cat}`} value={cat}>{cat}</option>
                ))}
              </select>

              {formData.category === "Others" && (
                <input
                  className="input-modern mt-2"
                  value={formData.otherCategory}
                  placeholder="Enter category"
                  onChange={(e) => setFormData({ ...formData, otherCategory: e.target.value })}
                />
              )}
            </div>

            {/* Details */}
            <div>
              <label className="font-semibold text-gray-700">Request Details *</label>
              <textarea
                className="input-modern h-28 resize-none"
                value={formData.requestDetails}
                placeholder="Describe your request..."
                onChange={(e) => setFormData({ ...formData, requestDetails: e.target.value })}
              />
            </div>

            {/* Urgency */}
            <div>
              <label className="font-semibold text-gray-700">Urgency *</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {["Emergency", "One Day", "This Week", "When Possible"].map((v) => (
                  <button
                    type="button"
                    key={`urgency-${v}`}
                    onClick={() => setFormData({ ...formData, urgency: v })}
                    className={`priority-btn ${formData.urgency === v && "priority-active"}`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? "Submitting..." : "Submit Request"}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>

      <style>{`
        .input-modern {
          width: 100%;
          padding: 10px;
          border: 1.5px solid #cbd5e1;
          border-radius: 8px;
          transition: .25s;
        }
        .input-modern:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 2px rgba(37,99,235,0.25);
        }
        .priority-btn {
          padding: 6px 12px;
          border: 1px solid #475569;
          border-radius: 6px;
          background: white;
          font-size: 12px;
          transition: .25s;
        }
        .priority-active {
          background: #2563eb;
          color: white;
          border-color: #2563eb;
        }
        .btn-primary {
          background: #2563eb;
          padding: 8px 16px;
          border-radius: 8px;
          color: white;
        }
        .btn-cancel {
          background: #e2e8f0;
          padding: 8px 16px;
          border-radius: 8px;
        }
      `}</style>
    </AnimatePresence>
  );
};

export default WorkOrderRequestModal;
