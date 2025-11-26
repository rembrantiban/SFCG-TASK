import axiosInstance from "../lib/axios";
import { useEffect, useState, useRef } from "react";
import { ClipboardList, User, Clock, Layers, Filter, ChevronLeft, ChevronRight, X } from "lucide-react";
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

  // 🔵 Viewer State
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerList, setViewerList] = useState([]);
  const [viewerIndex, setViewerIndex] = useState(0);

  // Zoom
  const [zoom, setZoom] = useState(1);

  // Drag gesture
  const dragStartY = useRef(null);

  useEffect(() => {
    loadTasks();
  }, []);

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

  // FILTER
  const applyFilter = (status) => {
    setFilterBy(status);
    if (status === "All") return setFiltered(tasks);
    setFiltered(tasks.filter((t) => t.assignedStatus === status));
  };

  // Open Viewer
  const openViewer = (images, index) => {
    setViewerList(images);
    setViewerIndex(index);
    setZoom(1);
    setViewerOpen(true);
  };

  // Navigation
  const nextImage = () => {
    if (viewerIndex < viewerList.length - 1) {
      setViewerIndex(viewerIndex + 1);
      setZoom(1);
    }
  };

  const prevImage = () => {
    if (viewerIndex > 0) {
      setViewerIndex(viewerIndex - 1);
      setZoom(1);
    }
  };

  // Swipe navigation
  const handleTouchStart = (e) => {
    dragStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e) => {
    const endY = e.touches[0].clientY;
    if (dragStartY.current - endY > 80) nextImage();
    if (endY - dragStartY.current > 80) prevImage();
  };

  // Drag down to close
  const handleDrag = (e) => {
    const endY = e.clientY;
    if (Math.abs(endY - dragStartY.current) > 120) {
      setViewerOpen(false);
    }
  };

  if (loading)
    return <p className="text-center mt-10 text-gray-600 animate-pulse text-sm">Loading assigned tasks...</p>;

  return (
    <div>
      {/* 🔵 IMAGE VIEWER MODAL */}
      {viewerOpen && (
        <div
          className="fixed inset-0 bg-black/90 z-[999] flex items-center justify-center select-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onMouseDown={(e) => (dragStartY.current = e.clientY)}
          onMouseUp={handleDrag}
        >
          {/* Close button */}
          <button
            onClick={() => setViewerOpen(false)}
            className="absolute top-5 right-5 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full"
          >
            <X size={26} />
          </button>

          {/* Prev */}
          {viewerIndex > 0 && (
            <button
              onClick={prevImage}
              className="absolute left-5 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full"
            >
              <ChevronLeft size={28} />
            </button>
          )}

          {/* Image */}
          <img
            src={viewerList[viewerIndex]}
            style={{ transform: `scale(${zoom})` }}
            className="max-w-[90vw] max-h-[85vh] object-contain transition-transform duration-200"
          />

          {/* Next */}
          {viewerIndex < viewerList.length - 1 && (
            <button
              onClick={nextImage}
              className="absolute right-5 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full"
            >
              <ChevronRight size={28} />
            </button>
          )}

          {/* Zoom Controls */}
          <div className="absolute bottom-8 flex gap-3">
            <button
              onClick={() => zoom > 0.5 && setZoom(zoom - 0.2)}
              className="bg-white/20 hover:bg-white/40 text-white px-4 py-2 rounded-full text-lg"
            >
              −
            </button>
            <button
              onClick={() => zoom < 3 && setZoom(zoom + 0.2)}
              className="bg-white/20 hover:bg-white/40 text-white px-4 py-2 rounded-full text-lg"
            >
              +
            </button>
          </div>
        </div>
      )}

      {/* PAGE HEADER */}
      <Header
        title="Task List"
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
              {user.role || "Admin"}
            </p>

            </div>
          </div>
        }
      />

      <div className="max-w-6xl mx-auto">

        {/* TITLE HEADER */}
        <div className="mb-8 text-center bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50 shadow-lg rounded-xl p-6 border border-gray-200">
          <h1 className="text-4xl font-extrabold text-gray-800 tracking-wide flex items-center justify-center gap-3 drop-shadow-lg">
            <ClipboardList size={40} className="text-blue-400" />
            Assigned Tasks Overview
          </h1>

          <p className="text-gray-500 text-sm mt-3 max-w-2xl mx-auto">
            A detailed summary of all assigned tasks, including their current status, assigned personnel, 
            and progress timelines to ensure smooth workflow and efficient task tracking.
          </p>
        </div>


        {/* FILTER */}
        <div className="flex gap-3 mb-6 justify-center bg-gray-50 border border-gray-300 rounded-xl  shadow p-2 max-w-2xl mx-auto">
          {["All", "Accepted", "Rejected", "Pending"].map((status) => (
            <button
              key={status}
              onClick={() => applyFilter(status)}
              className={`
                px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 border transition
                ${filterBy === status
                  ? "bg-blue-600 text-white border-blue-600 shadow"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"}
              `}
            >
              <Filter size={16} /> {status}
            </button>
          ))}
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((t) => (
            <div
              key={t._id}
              className="bg-white p-5 rounded-xl shadow border border-gray-300 hover:shadow-lg transition"
            >
              <div
              className={`px-3 py-1 rounded-full text-xs font-semibold inline-block
                ${
                  t.status === "Pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : t.status === "In Progress"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-green-100 text-green-700"
                }
              `}
            >
              {t.status}
            </div>

              {/* TITLE */}
              <h2 className="text-lg font-semibold">{t.requestId?.taskType}</h2>

              <div className="flex items-center text-sm text-gray-500 gap-1">
                <Layers size={14} />
                <span>{t.requestId?.category}</span>
              </div>

              <hr className="my-3" />

              {/* INFO */}
              <div className="text-sm space-y-2">
                <div className="flex items-center gap-2">
                  <User size={16} className="text-blue-600" />
                  <span>
                    <strong>Assigned to:</strong> {t.assign?.firstName} {t.assign?.lastName}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-green-600" />
                  <span>
                    <strong>Approval:</strong>{" "}
                    <span
                      className={`px-2 py-1 rounded-md text-xs font-semibold ${
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

              {/* IMAGES */}
              {t.proofUrls?.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm font-semibold mb-1">Proof Images:</p>
                  <div className="grid grid-cols-3 gap-2">
                    {t.proofUrls.map((url, idx) => (
                      <img
                        key={idx}
                        src={url}
                        onClick={() => openViewer(t.proofUrls, idx)}
                        className="h-20 w-full object-cover rounded-lg shadow cursor-pointer hover:scale-105 transition"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* FOOTER */}
              <div className="mt-4 text-xs text-gray-400">
                Assign Date: {new Date(t.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AssignedTaskPage;
