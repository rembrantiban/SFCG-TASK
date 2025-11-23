import React, { useEffect, useState } from "react";
import axiosInstance from "../../lib/axios";
import { Search, Plus, Edit3, Trash2, Building2 } from "lucide-react";
import AddDepartmentModal from "../modal/addDepartmentModal";
import { toast } from "react-hot-toast";
import EditDepartmentModal from "../modal/editDepartmentModal";
import DeleteDepartmentModal from "../modal/deleteDepartmentModal";
import AddCategoryModal from "../modal/addCategoryModal";

const DepartmentList = () => {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [openAddModal, setOpenAddModal] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedDept, setSelectedDept] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [addCategoryModalOpen, setAddCategoryModalOpen] = useState(false);
    const [selectedDeptForCategory, setSelectedDeptForCategory] = useState(null);


    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        try {
            const res = await axiosInstance.get("/department/getalldepartment");
            setDepartments(res.data.departments || []);
        } catch (error) {
            console.error("Failed to load departments:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateDepartment = (updatedDept) => {
        setDepartments(prev =>
            prev.map((d) => (d._id === updatedDept._id ? updatedDept : d))
        );
    };

    const confirmDelete = async () => {
    try {
        const res = await axiosInstance.delete(`/department/deletedepartment/${selectedDept._id}`);
        if (res.data.success) {
            toast.success("Department deleted successfully!");
            setDepartments(prev => prev.filter(d => d._id !== selectedDept._id));
        }
    } catch (err) {
        toast.error("Failed to delete department");
    }
    setDeleteModalOpen(false);
};

    const filteredData = departments.filter((d) =>
        d.departmentName.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="w-full max-w-5xl mx-auto p-6 bg-gray-100 dark:bg-gray-900 rounded-xl text-gray-900 dark:text-white shadow-lg">

            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Building2 className="text-blue-600" /> Department Management
                </h2>

                <button
                    onClick={() => setOpenAddModal(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow text-sm font-medium transition"
                >
                    <Plus size={18} /> Add Department
                </button>
            </div>

            <p className="mb-4 text-gray-600 dark:text-gray-400 text-sm">
                Manage, add, or remove school/office departments below.
            </p>

            {/* Search */}
            <div className="relative mb-4">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input
                    type="text"
                    placeholder="Search department..."
                    className="w-full pl-10 pr-3 py-2 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* Department Table */}
            <div className="overflow-x-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 uppercase text-xs">
                        <tr>
                            <th className="px-4 py-3">#</th>
                            <th className="px-4 py-3">Department Name</th>
                            <th className="px-4 py-3 text-center">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y dark:divide-gray-700">
    {loading ? (
        <tr>
            <td colSpan="3" className="py-4 text-center text-gray-500">
                Loading...
            </td>
        </tr>
    ) : filteredData.length === 0 ? (
        <tr>
            <td colSpan="3" className="py-4 text-center text-gray-500">
                No data found
            </td>
        </tr>
    ) : (
        filteredData.map((dept, index) => (
            <React.Fragment key={dept._id}>
                {/* MAIN ROW */}
                <tr className="hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3 font-medium capitalize">
                        {dept.departmentName}
                    </td>

                    <td className="px-4 py-3 flex justify-center gap-2">
                        <button
                            onClick={() => {
                                setSelectedDeptForCategory(dept);
                                setAddCategoryModalOpen(true);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium flex items-center gap-1"
                        >
                            <Plus size={14} /> Category
                        </button>

                        <button
                            onClick={() => {
                                setSelectedDept(dept);
                                setEditModalOpen(true);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-green-500 hover:bg-green-600 text-white text-xs font-medium flex items-center gap-1"
                        >
                            <Edit3 size={14} /> Edit
                        </button>

                        <button
                            onClick={() => {
                                setSelectedDept(dept);
                                setDeleteModalOpen(true);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-xs font-medium flex items-center gap-1"
                        >
                            <Trash2 size={14} /> Delete
                        </button>
                    </td>
                </tr>

                {/* CATEGORY ROW */}
                <tr className="bg-gray-50 dark:bg-gray-800">
                    <td colSpan="3" className="px-6 py-3 text-sm text-gray-600 dark:text-gray-300">
                        <strong className="text-gray-800 dark:text-white">Categories:</strong>
                        {dept.categories.length > 0 ? (
                            <div className="mt-1 flex flex-wrap gap-2">
                                {dept.categories.map((cat, i) => (
                                    <span
                                        key={i}
                                        className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-lg text-xs"
                                    >
                                        {cat}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400 mt-1">
                                No categories yet.
                            </p>
                        )}
                    </td>
                </tr>
            </React.Fragment>
        ))
    )}
</tbody>

                </table>
            </div>

            {/* Add Department Modal */}
            <AddDepartmentModal
                isOpen={openAddModal}
                onClose={() => setOpenAddModal(false)}
                onSuccess={(newDept) => setDepartments((prev) => [...prev, newDept])}
            />

            <AddCategoryModal
                isOpen={addCategoryModalOpen}
                onClose={() => setAddCategoryModalOpen(false)}
                department={selectedDeptForCategory}
                onCategoryAdded={(updatedDept) => {
                    setDepartments(prev =>
                        prev.map((d) => (d._id === updatedDept._id ? updatedDept : d))
                    );
                }}
            />


            <DeleteDepartmentModal
            isOpen={deleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
            onConfirm={confirmDelete}
            departmentName={selectedDept?.departmentName}
            />


            <EditDepartmentModal
                isOpen={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                departmentData={selectedDept}
                onUpdate={handleUpdateDepartment}
            />

        </div>
    );
};

export default DepartmentList;
