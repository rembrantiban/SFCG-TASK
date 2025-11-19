import React, { useEffect, useState } from "react";
import axiosInstance from "../../lib/axios";
import { X, User } from "lucide-react";
import { toast } from "react-hot-toast";

const AssignModal = ({ isOpen, request, onClose, onAssigned }) => {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [assigning, setAssigning] = useState(false);

 
  useEffect(() => {
    if (!isOpen || !request) return;

    const fetchUsers = async () => {
      setLoadingUsers(true);
      try {
        const category = request.category;
        const res = await axiosInstance.get(`/auth/getalluser?category=${category}`);

        if (res.data.success) {
          setUsers(res.data.users);
        }
      } catch (err) {
        console.error("Error loading users:", err);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, [isOpen, request]);

  
  const handleAssign = async (userId) => {
  if (!request) return;

  const loggedUserId = localStorage.getItem("userId"); // ✔ Coordinator assigning user

  if (!loggedUserId) {
    toast.error("No logged-in user found! Please log in again.");
    return;
  }

  setAssigning(true);

  try {
    const body = {
      requestId: request._id,
      assigneeId: userId,
      createdBy: loggedUserId,   // ✔ Correct user assigning
    };

    const res = await axiosInstance.post("/assign/assign-user", body);

    if (res.data.success) {
      toast.success("Request assigned successfully!");
      onAssigned?.();
      onClose();
    }
  } catch (err) {
    console.error("ASSIGN ERROR:", err.response?.data || err);
    toast.error(err.response?.data?.message || "Failed to assign request");
  } finally {
    setAssigning(false);
  }
};

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm transition
      ${isOpen ? "visible opacity-100" : "invisible opacity-0"}`}
    >
      <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg relative">

        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 bg-gray-200 p-2 rounded-full hover:bg-gray-300"
        >
          <X size={18} />
        </button>

        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          Assign Request
        </h2>


        {loadingUsers ? (
          <p className="text-gray-600">Loading available staff...</p>
        ) : users.length === 0 ? (
          <p className="text-gray-600">No users available for this category.</p>
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
                    {u.firstName} {u.lastName} <br />
                    <span className="text-sm text-gray-500">{u.category}</span>
                  </span>
                </div>

                <button
                  className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-500"
                  disabled={assigning}
                  onClick={() => handleAssign(u._id)}
                >
                  Assign
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignModal;
