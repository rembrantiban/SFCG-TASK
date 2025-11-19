import React, { useState } from "react";
import { X } from "lucide-react";
import axiosInstance from "../../lib/axios";
import { toast } from "react-hot-toast";

const AddCategoryModal = ({ isOpen, onClose, department, onCategoryAdded }) => {
    const [category, setCategory] = useState("");
    const [loading, setLoading] = useState(false);

    if (!isOpen || !department) return null;

    const handleAddCategory = async () => {
        if (!category.trim()) {
            return toast.error("Category name is required");
        }

        try {
            setLoading(true);

            const res = await axiosInstance.put(
                `/department/addcategory/${department._id}`,
                { category }
            );

            if (res.data.success) {
                toast.success("Category added successfully!");
                onCategoryAdded(res.data.department);
                setCategory("");
                onClose();
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to add category");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
            <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 relative">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-black"
                >
                    <X size={20} />
                </button>

                {/* Header */}
                <h2 className="text-lg font-bold mb-2">
                    Add Category to {department.departmentName}
                </h2>
                <p className="text-sm text-gray-600 mb-4">Add a new category for this department.</p>

                {/* Input */}
                <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Enter new category"
                    className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-300 outline-none"
                />

                {/* Footer Buttons */}
                <div className="mt-5 flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-md"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleAddCategory}
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                    >
                        {loading ? "Adding..." : "Add Category"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddCategoryModal;
