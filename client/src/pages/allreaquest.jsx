import React, { useEffect, useState } from "react";
import axiosInstance from "../lib/axios";
import Header from "../component/common/header";
import {
  ClipboardList,
  Clock,
  User,
  Tag,
  Filter,
  Search,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";

const AllRequest = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const loadRequests = async () => {
    try {
      const res = await axiosInstance.get("/request/all");
      if (res.data.success) {
        setRequests(res.data.requests);
      }
    } catch (err) {
      console.error("Error loading requests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const user = {
    firstName: localStorage.getItem("userFirstName") || "",
    lastName: localStorage.getItem("userLastName") || "",
    role: localStorage.getItem("userRole") || "",
    depart: localStorage.getItem("userDepart") || "",
  };

  const filteredRequests = requests.filter((req) => {
    return (
      (statusFilter === "All" || req.status === statusFilter) &&
      (categoryFilter === "All" || req.category === categoryFilter) &&
      (req.taskType.toLowerCase().includes(search.toLowerCase()) ||
        req.requestDetails.toLowerCase().includes(search.toLowerCase()))
    );
  });

  if (loading) {
    return (
      <p className="text-center mt-10 text-gray-600 animate-pulse">
        Loading requests...
      </p>
    );
  }

  return (
    <div>
      <Header
        title="All Work Requests"
        subtitle={`Welcome back ${user.firstName} ${user.lastName}!`}
        actions={
          <div className="flex items-center gap-3  rounded-lg px-3 py-1.5 shadow hover:shadow-md transition cursor-pointer">
            <img
              src={user.image || "avatar.png"}
              alt="profile"
              className="w-9 h-9 rounded-full border-white object-cover border-2"
            />
            <div className="text-left leading-tight">
              <p className="text-sm text-white font-semibold ">
                {user.firstName} {user.lastName}
              </p>
              <p
                className={`text-xs font-medium px-3 py-0.5 rounded-full text-center capitalize shadow-sm
              ${user.role === "Admin" ? "bg-orange-900 text-white" :
                user.role === "Staff" ? "bg-green-600 text-white" :
                "bg-amber-900 text-white"}`}
              >
                {user.role}
              </p>
            </div>
          </div>
        }
      />

      <div className="max-w-6xl mx-auto px-5 py-8">
        {/* HEADER */}
        <div className="text-center mb-6  bg-gradient-to-r shadow-sm rounded p-2 from-gray-800 via-gray-900 to-gray-900">
          <h1 className="text-3xl font-bold text-gray-200 flex items-center justify-center gap-2">
            <ClipboardList className="text-blue-600" size={30} />
            All Work Requests
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            View and monitor all submitted work order requests
          </p>
        </div>

        {/* FILTER BAR */}
        <div className="bg-white shadow rounded-lg p-4 mb-6 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                placeholder="Search task or details..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border rounded-lg text-sm"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-3 text-gray-400" size={18} />
              <select
                className="w-full pl-10 py-2 border rounded-lg text-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option>All</option>
                <option>Pending</option>
                <option>Noted</option>
                <option>Approved</option>
                <option>Completed</option>
                <option>Rejected</option>
              </select>
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Tag className="absolute left-3 top-3 text-gray-400" size={18} />
              <select
                className="w-full pl-10 py-2 border rounded-lg text-sm"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option>All</option>
                <option>Carpentry</option>
                <option>Electrical</option>
                <option>Painting</option>
                <option>Plumbing</option>
                <option>Others</option>
              </select>
            </div>
          </div>
        </div>

        {/* REQUEST GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRequests.map((req) => (
            <div
              key={req._id}
              className="bg-white rounded-xl shadow border border-gray-200 p-5 hover:shadow-lg transition duration-200"
            >
              {/* Title */}
              <h2 className="text-lg font-semibold text-gray-900 mb-1">
                {req.taskType}
              </h2>

              {/* Category */}
              <p className="flex items-center text-sm text-gray-600 gap-1 mb-2">
                <Tag size={14} className="text-blue-600" />
                {req.category}
              </p>

              {/* Status Badge */}
              <span
                className={`px-3 py-1 rounded-md text-xs font-semibold inline-block mb-3
                ${
                  req.status === "Pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : req.status === "Approved"
                    ? "bg-green-100 text-green-700"
                    : req.status === "Noted"
                    ? "bg-blue-100 text-blue-700"
                    : req.status === "Completed"
                    ? "bg-purple-100 text-purple-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {req.status}
              </span>

              {/* Request Details */}
              <p className="text-gray-600 text-sm line-clamp-3 mb-3">
                {req.requestDetails}
              </p>

              {/* Requested By */}
              <div className="text-sm text-gray-800 flex items-center gap-2 mb-2">
                <User size={16} className="text-blue-600" />
                Requested By:{" "}
                <strong>
                  {req.requestedBy?.firstName} {req.requestedBy?.lastName}
                </strong>
              </div>

              {/* Noted By */}
              {req.notedBy && (
                <p className="text-sm text-gray-800 mb-1">
                  ✔ Noted By:{" "}
                  <strong>
                    {req.notedBy.firstName} {req.notedBy.lastName}
                  </strong>
                </p>
              )}

              {/* Approved By */}
              {req.approvedBy && (
                <p className="text-sm text-gray-800 mb-1">
                  ✔ Approved By:{" "}
                  <strong>
                    {req.approvedBy.firstName} {req.approvedBy.lastName}
                  </strong>
                </p>
              )}

              {/* Date */}
              <div className="text-xs text-gray-400 mt-3 flex items-center gap-1">
                <Clock size={14} />
                {new Date(req.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>

        {/* EMPTY STATE */}
        {filteredRequests.length === 0 && (
          <p className="text-center mt-10 text-gray-500 text-sm">
            No requests found.
          </p>
        )}
      </div>
    </div>
  );
};

export default AllRequest;
