import React, { useEffect, useState } from "react";
import axiosInstance from "../../lib/axios";
import { X, User, RefreshCcw } from "lucide-react";
import { toast } from "react-hot-toast";

const ReassignedModal = ({ isOpen, task, onClose, onReassigned }) => {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!isOpen || !task) return;

    const fetchUsers = async () => {
      setLoadingUsers(true);
      try {
        const category = task?.requestId?.category;

        const res = await axiosInstance.get(`/auth/getalluser?category=${category}`);

        if (res.data.success) {
          setUsers(res.data.users);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, [isOpen, task]);

  const handleReassign = async (newUserId) => {
    if (!task?._id) return;

    setProcessing(true);

    try {
      const res = await axiosInstance.patch(
        `/assign/reassign/${task._id}`,
        { newUserId }
      );

      if (res.data.success) {
        toast.success("Task successfully re-assigned!");
        onReassigned?.();
        onClose();
      }
    } catch (error) {
      console.error("Reassign error:", error);
      toast.error(error.response?.data?.message || "Failed to re-assign task");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 transition
      ${isOpen ? "visible opacity-100" : "invisible opacity-0"}`}
    >
      <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl relative">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 bg-gray-200 p-2 rounded-full hover:bg-gray-300"
        >
          <X size={18} />
        </button>

        {/* Title */}
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <RefreshCcw className="text-blue-600" /> Re-Assign Task
        </h2>

        {/* Task Info */}
        <div className="mb-4 p-3 bg-gray-100 rounded-lg text-sm">
          <p>
            <span className="font-semibold">Task:</span>{" "}
            {task?.requestId?.taskType}
          </p>
          <p>
            <span className="font-semibold">Category:</span>{" "}
            {task?.requestId?.category}
          </p>
        </div>

        {/* Loading or Empty Users */}
        {loadingUsers ? (
          <p className="text-gray-600 text-sm">Loading available staff...</p>
        ) : users.length === 0 ? (
          <p className="text-gray-600 text-sm">
            No available users for this category.
          </p>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {users.map((u) => (
              <div
                key={u._id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <User size={20} className="text-blue-600" />
                  <span>
                    {u.firstName} {u.lastName}
                    <br />
                    <span className="text-sm text-gray-500">{u.category}</span>
                  </span>
                </div>

                <button
                  className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                  disabled={processing}
                  onClick={() => handleReassign(u._id)}
                >
                  Re-Assign
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReassignedModal;
