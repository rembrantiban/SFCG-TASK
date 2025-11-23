import React, { useEffect, useState, useMemo } from "react";
import axiosInstance from "../../lib/axios";
import { X, User, Search } from "lucide-react";
import { toast } from "react-hot-toast";

const AssignModal = ({ isOpen, request, onClose, onAssigned, isReassign = false }) => {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [search, setSearch] = useState("");

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

  // 🔍 Filter Users
  const filteredUsers = useMemo(() => {
    return users.filter((u) =>
      `${u.firstName} ${u.lastName}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [search, users]);

  const handleAssign = async (userId) => {
    if (!request) return;

    if (request.assign?._id === userId) {
      toast.error("This user is already assigned to the request.");
      return;
    }

    const loggedUserId = localStorage.getItem("userId");

    if (!loggedUserId) {
      toast.error("No logged-in user found!");
      return;
    }

    setAssigning(true);

    try {
      const body = {
        requestId: request._id,
        assigneeId: userId,
        createdBy: loggedUserId,
      };

      const res = await axiosInstance.post("/assign/assign-user", body);

      if (res.data.success) {
        toast.success(isReassign ? "Request reassigned!" : "Request assigned!");
        onAssigned?.();
        onClose();
      }
    } catch (err) {
      console.error("ASSIGN ERROR:", err.response?.data || err);
      toast.error(err.response?.data?.message || "Failed to assign");
    } finally {
      setAssigning(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm transition
      ${isOpen ? "visible opacity-100" : "invisible opacity-0"}`}
    >
      <div className="bg-white p-6 rounded-2xl w-full max-w-lg shadow-xl relative border border-gray-200">

        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 bg-gray-100 p-2 rounded-full hover:bg-gray-200"
        >
          <X size={18} />
        </button>

        <h2 className="text-2xl font-bold mb-4 text-gray-900 flex items-center gap-2">
          {isReassign ? "Reassign Request" : "Assign Request"}
        </h2>

        {/* 🔍 Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search staff..."
            className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* User List */}
        {loadingUsers ? (
          <p className="text-gray-600">Loading staff...</p>
        ) : filteredUsers.length === 0 ? (
          <p className="text-gray-600">No matching staff found.</p>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {filteredUsers.map((u) => (
              <div
                key={u._id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-100 cursor-pointer transition"
              >
                <div className="flex items-center gap-3">
                  <User size={20} className="text-blue-600" />
                  <div>
                    <p className="font-semibold text-gray-800">
                      {u.firstName} {u.lastName}
                    </p>
                    <p className="text-xs text-gray-500">{u.category}</p>
                  </div>
                </div>

                <button
                  className={`px-3 py-1 rounded-lg text-white text-sm transition ${
                    isReassign
                      ? "bg-yellow-500 hover:bg-yellow-600"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                  disabled={assigning}
                  onClick={() => handleAssign(u._id)}
                >
                  {isReassign ? "Reassign" : "Assign"}
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
