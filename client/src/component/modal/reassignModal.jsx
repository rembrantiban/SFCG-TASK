import React, { useEffect, useState, useMemo } from "react";
import axiosInstance from "../../lib/axios";
import { X, User, Search } from "lucide-react";
import { toast } from "react-hot-toast";

const ReassignModal = ({ isOpen, request, onClose, onReassigned }) => {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [reassigning, setReassigning] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  /** 🔹 Load Users Matching Category */
  useEffect(() => {
    if (!isOpen || !request) return;

    const fetchUsers = async () => {
      setLoadingUsers(true);
      try {
        const res = await axiosInstance.get(
          `/auth/getalluser?category=${request.category}`
        );

        if (res.data.success) setUsers(res.data.users);
      } catch (err) {
        console.error("Error loading users:", err);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, [isOpen, request]);

 
const filteredUsers = useMemo(() => {
  return users.filter((u) => {
    const fullName = `${u.firstName || ""} ${u.lastName || ""}`.toLowerCase();
    const category = (u.category || "").toLowerCase();
    const term = (search || "").toLowerCase();

    return (
      fullName.includes(term) ||
      category.includes(term)
    );
  });
}, [search, users]);


 const handleReassign = async () => {
  if (!selectedUser) {
    toast.error("Please select a user first.");
    return;
  }

  if (!request) return;

  setReassigning(true);

  try {
    const res = await axiosInstance.patch(
      `/assign/reassign/${request._id}`,
      { newUserId: selectedUser._id }
    );

    if (res.data.success) {
      toast.success("Request reassigned successfully!");
      onReassigned?.();
      onClose();
    }
  } catch (err) {
    console.error("REASSIGN ERROR:", err.response?.data || err);
    toast.error(err.response?.data?.message || "Failed to reassign");
  } finally {
    setReassigning(false);
  }
};


  return (
    <div
      className={`fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[999] transition
      ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
    >
      <div className="bg-white w-full max-w-lg p-6 rounded-2xl shadow-xl border border-gray-200 relative">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full"
        >
          <X size={18} />
        </button>

        <h2 className="text-2xl font-bold mb-4 text-gray-900">
          Reassign Request
        </h2>

        {/* 🔍 Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by name or category..."
            className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Staff List */}
        {loadingUsers ? (
          <p className="text-gray-500">Loading staff...</p>
        ) : filteredUsers.length === 0 ? (
          <p className="text-gray-600">No matching staff found.</p>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {filteredUsers.map((u) => (
              <div
                key={u._id}
                className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition 
                ${selectedUser?._id === u._id ? "bg-blue-50 border-blue-400" : "hover:bg-gray-100"}`}
                onClick={() => setSelectedUser(u)}
              >
                {/* User Info */}
                <div className="flex items-center gap-3">
                  <User size={22} className="text-blue-600" />
                  <div>
                    <p className="font-semibold">
                      {u.firstName} {u.lastName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {u.category}
                    </p>
                  </div>
                </div>

                {/* Select Icon */}
                {selectedUser?._id === u._id && (
                  <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                    Selected
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={handleReassign}
          disabled={reassigning}
          className="w-full mt-5 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg transition shadow-sm disabled:bg-gray-400"
        >
          {reassigning ? "Reassigning..." : "Reassign Request"}
        </button>
      </div>
    </div>
  );
};

export default ReassignModal;
