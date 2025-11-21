import axiosInstance from "../lib/axios";
import { useEffect, useState } from "react";
import { ClipboardList, User, Clock, Layers, Filter } from "lucide-react";
import Header from "../component/common/header";

const AssignedTaskPage = () => {
  const user = {
    firstName: localStorage.getItem("userFirstName") || "",
    lastName: localStorage.getItem("userLastName") || "",
    role: localStorage.getItem("userRole") || "",
    depart: localStorage.getItem("userDepart") || "",
  };

  const [tasks, setTasks] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterBy, setFilterBy] = useState("All");

  const loadTasks = async () => {
    try {
      const res = await axiosInstance.get("/assign/all");
      if (res.data.success) {
        setTasks(res.data.tasks);
        setFiltered(res.data.tasks);
      }
    } catch (err) {
      console.error("Error loading tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  // 🔵 FILTER LOGIC
  const applyFilter = (status) => {
    setFilterBy(status);

    if (status === "All") return setFiltered(tasks);
    setFiltered(tasks.filter((t) => t.assignedStatus === status));
  };

  if (loading)
    return (
      <p className="text-center mt-10 text-gray-600 animate-pulse text-sm">
        Loading assigned tasks...
      </p>
    );

  return (
    <div>
      <Header
        title="Task List"
        subtitle={`Welcome back ${user.firstName} ${user.lastName}!`}
        actions={
          <div className="flex items-center gap-3 rounded-lg px-3 py-1.5 shadow hover:shadow-md transition cursor-pointer">
            <img
              src={user.image || "avatar.png"}
              alt="profile"
              className="w-9 h-9 rounded-full border-white object-cover border-2"
            />
            <div className="text-left leading-tight">
              <p className="text-sm text-white font-semibold">
                {user.firstName} {user.lastName}
              </p>
              <p
                className={`text-xs font-medium px-3 py-0.5 rounded-full text-center capitalize shadow-sm
              ${
                user.role === "Admin"
                  ? "bg-orange-900 text-white"
                  : user.role === "Staff"
                  ? "bg-green-600 text-white"
                  : "bg-amber-900 text-white"
              }`}
              >
                {user.role || "Admin"}
              </p>
            </div>
          </div>
        }
      />

      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="mb-6 text-center bg-gradient-to-r shadow-sm rounded p-2 from-gray-800 via-gray-900 to-gray-900">
          <h1 className="text-3xl font-bold text-gray-100 tracking-tight flex items-center justify-center gap-2">
            <ClipboardList size={32} className="text-blue-600" />
            Assigned Tasks Overview
          </h1>
          <p className="text-gray-400 mt-1 text-sm">
            View all staff task assignments with live updates
          </p>
        </div>

        {/* 🔵 FILTER BUTTONS */}
        <div className="flex gap-3 mb-6 justify-center bg-gray-50 border border-gray-200 rounded-2xl shadow-sm max-w-2xl p-2">
          {["All", "Accepted", "Rejected", "Pending"].map((status) => (
            <button
              key={status}
              onClick={() => applyFilter(status)}
              className={`
                px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition border
                ${
                  filterBy === status
                    ? "bg-blue-600 text-white border-blue-600 shadow"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                }
              `}
            >
              <Filter size={16} />
              {status}
            </button>
          ))}
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((t) => (
            <div
              key={t._id}
              className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition duration-200 cursor-pointer"
            >
              {/* TITLE */}
              <h2 className="text-lg font-semibold text-gray-800 mb-1">
                {t?.requestId?.taskType}
              </h2>

              <div className="flex items-center text-sm text-gray-500 gap-1">
                <Layers size={14} />
                <span>{t?.requestId?.category}</span>
              </div>

              <hr className="my-3" />

              {/* ASSIGNED INFO */}
              <div className="text-sm space-y-2">
                <div className="flex items-center gap-2">
                  <User size={16} className="text-blue-600" />
                  <span>
                    <strong>Assigned to:</strong> {t.assign?.firstName}{" "}
                    {t.assign?.lastName}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-green-600" />
                  <span>
                    <strong>Status:</strong>{" "}
                    <span
                      className={`px-2 py-1 rounded-md text-xs font-semibold
                        ${
                          t.assignedStatus === "Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : t.assignedStatus === "Accepted"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                    >
                      {t.assignedStatus}
                    </span>
                  </span>
                </div>
              </div>

              {/* DETAILS */}
              <p className="text-gray-600 text-sm mt-3 line-clamp-3">
                {t.requestId?.requestDetails}
              </p>

              {/* FOOTER */}
              <div className="mt-4 text-xs text-gray-400">
                Assign Date: {new Date(t.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center mt-10 text-gray-600 text-sm">
            No tasks found for filter: <strong>{filterBy}</strong>
          </p>
        )}
      </div>
    </div>
  );
};

export default AssignedTaskPage;
