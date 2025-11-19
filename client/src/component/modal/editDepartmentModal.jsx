import React, { useState, useEffect } from "react";
import { X, Building2, Save } from "lucide-react";
import axiosInstance from "../../lib/axios";
import { toast } from "react-hot-toast";

const EditDepartmentModal = ({ isOpen, onClose, departmentData, onUpdate }) => {
  const [name, setName] = useState("");

  useEffect(() => {
    if (departmentData) {
      setName(departmentData.departmentName || "");
    }
  }, [departmentData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Department name is required!");
      return;
    }

    try {
      const res = await axiosInstance.put(`/department/updatedepartment/${departmentData._id}`, {
        departmentName: name.trim(),
      });

      if (res.data.success) {
        toast.success("Department updated successfully!");
        onUpdate(res.data.department);
        onClose();
      }
    } catch (error) {
      console.error("Error updating department:", error);
      toast.error("Failed to update. Try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl w-[400px] shadow-2xl animate-fade-in relative border border-gray-300 dark:border-gray-700">

        {/* Close Button */}
        <button
          className="absolute top-3 right-3 hover:bg-gray-200 dark:hover:bg-gray-700 p-1.5 rounded-full"
          onClick={onClose}
        >
          <X size={18} className="text-gray-700 dark:text-gray-300" />
        </button>

        {/* Title */}
        <h2 className="text-xl font-bold text-center mb-4 flex items-center justify-center gap-2 text-gray-800 dark:text-white">
          <Building2 size={22} className="text-blue-600" />
          Edit Department
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-md border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter department name"
            autoFocus
          />

          <div className="flex gap-2 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 font-medium transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="w-full px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium flex items-center justify-center gap-2 transition"
            >
              <Save size={18} /> Update
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default EditDepartmentModal;
