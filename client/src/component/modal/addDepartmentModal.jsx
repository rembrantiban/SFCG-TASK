import React, { useState } from "react";
import { X, Building2, Loader2, PlusCircle } from "lucide-react";
import axiosInstance from "../../lib/axios";
import { toast } from "react-hot-toast";

const AddDepartmentModal = ({ isOpen, onClose, onSuccess }) => {
  const [departmentName, setDepartmentName] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (departmentName.trim() === "") {
      toast.error("Department name is required!");
      return;
    }

    setLoading(true);

    try {
      const res = await axiosInstance.post("/department/create", {
        departmentName,
      });

      if (res.data.success) {
        toast.success("Department added successfully!");
        setDepartmentName("");
        onSuccess(res.data.department);
        onClose();
      } else {
        toast.error(res.data.message || "Failed to create department");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-gray-900 w-[450px] rounded-2xl shadow-xl p-6 animate-scaleIn border border-gray-300 dark:border-gray-700 relative">

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-200 hover:bg-gray-300 
          dark:bg-gray-700 dark:hover:bg-gray-600 transition"
        >
          <X size={18} className="text-gray-800 dark:text-gray-200" />
        </button>

        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 text-center mb-5 flex items-center justify-center gap-2">
          <Building2 size={22} className="text-blue-500" />
          Add New Department
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Building2 size={18} className="absolute left-3 top-3 text-gray-500" />
            <input
              type="text"
              placeholder="Enter Department Name"
              className="w-full border rounded-lg pl-10 pr-3 py-2 bg-white dark:bg-gray-800 
              dark:border-gray-700 text-gray-700 dark:text-gray-300 focus:ring-2 
              focus:ring-blue-500 outline-none"
              value={departmentName}
              onChange={(e) => setDepartmentName(e.target.value)}
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 
              dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium py-2 
              rounded-lg transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium flex 
              items-center justify-center gap-2 py-2 rounded-lg transition disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4" /> Add
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDepartmentModal;
