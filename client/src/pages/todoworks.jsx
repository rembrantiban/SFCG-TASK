import React, { useEffect, useState, useRef } from "react";
import axiosInstance from "../lib/axios";
import StaffHeader from "../component/staffheader/header";
import {
  ClipboardList,
  User,
  FileText,
  XCircle,
  CheckCircle,
  Activity,
  Loader2,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const TodoWorks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Upload loading
  const [uploadingTaskId, setUploadingTaskId] = useState(null);

  // Preview images before upload (local, not from server)
  const [previewImages, setPreviewImages] = useState({});

  // Image viewer: gallery state
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerImages, setViewerImages] = useState([]);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [viewerZoom, setViewerZoom] = useState(1);

  const touchStartRef = useRef({ x: 0, y: 0 });

  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  const [completeModalOpen, setCompleteModalOpen] = useState(false);
  const [selectedCompleteTaskId, setSelectedCompleteTaskId] = useState(null);

  const userId = localStorage.getItem("userId");
  const firstName = localStorage.getItem("userFirstName") || "Staff";

  useEffect(() => {
    if (!userId) return;
    loadTasks();

    const interval = setInterval(() => loadTasks(false), 10000);
    return () => clearInterval(interval);
  }, [userId]);

  // Load tasks
  const loadTasks = async (showLoader = true) => {
    if (showLoader) setLoading(true);
    try {
      const res = await axiosInstance.get(`/assign/usertasks/${userId}`);
      if (res.data.success) setTasks(res.data.tasks);
    } catch (err) {
      console.error("Failed loading tasks:", err);
    } finally {
      if (showLoader) setLoading(false);
    }
  };

  // Upload images
  const handleMultipleProofs = async (taskId, files) => {
    if (!files || files.length === 0) return;

    // Local preview
    const previewList = [];
    for (let file of files) {
      previewList.push(URL.createObjectURL(file));
    }
    setPreviewImages((prev) => ({ ...prev, [taskId]: previewList }));
    setUploadingTaskId(taskId);

    const formData = new FormData();
    for (let f of files) formData.append("images", f);

    try {
      const uploadRes = await axiosInstance.post("/assign/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const urls = uploadRes.data.urls;
      await axiosInstance.put(`/assign/proof/${taskId}`, { urls });

      toast.success("Images uploaded successfully!");
      loadTasks(false);
    } catch (err) {
      toast.error("Upload failed");
      console.log(err);
    } finally {
      setUploadingTaskId(null);
    }
  };

  const updateStatus = async (taskId, newStatus) => {
    try {
      const res = await axiosInstance.put(`/assign/status/${taskId}`, {
        status: newStatus,
      });
      if (res.data.success) {
        toast.success(`Marked as ${newStatus}`);
        loadTasks(false);
      }
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleStatusClick = (task, statusName) => {
    if (task.status === statusName) return; // already active

    if (statusName === "Completed") {
      setSelectedCompleteTaskId(task._id);
      setCompleteModalOpen(true);
    } else {
      updateStatus(task._id, statusName);
    }
  };

  const handleAccept = async (taskId) => {
    try {
      const res = await axiosInstance.put(`/assign/accept/${taskId}`);
      if (res.data.success) {
        toast.success("Task accepted!");
        loadTasks(false);
      }
    } catch {
      toast.error("Error accepting task");
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) return toast.error("Enter a reason");

    try {
      const res = await axiosInstance.put(`/assign/reject/${selectedTaskId}`, {
        rejectReason,
      });

      if (res.data.success) {
        toast.success("Task rejected");
        setRejectModalOpen(false);
        setRejectReason("");
        loadTasks(false);
      }
    } catch {
      toast.error("Failed to reject");
    }
  };

  const getProgressPercent = (task) => {
    if (task.status === "Completed") return 100;
    if (task.status === "Pending") return 60;
    return 30;
  };

  const openViewer = (images, index) => {
    setViewerImages(images || []);
    setViewerIndex(index || 0);
    setViewerZoom(1);
    setViewerOpen(true);
  };

  const closeViewer = () => {
    setViewerOpen(false);
  };

  const showNext = () => {
    if (!viewerImages.length) return;
    setViewerIndex((prev) => (prev + 1) % viewerImages.length);
    setViewerZoom(1);
  };

  const showPrev = () => {
    if (!viewerImages.length) return;
    setViewerIndex((prev) =>
      prev === 0 ? viewerImages.length - 1 : prev - 1
    );
    setViewerZoom(1);
  };

  const zoomIn = () => {
    setViewerZoom((prev) => Math.min(prev + 0.25, 3));
  };

  const zoomOut = () => {
    setViewerZoom((prev) => Math.max(prev - 0.25, 0.5));
  };

  const resetZoom = () => {
    setViewerZoom(1);
  };

  const handleViewerTouchStart = (e) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleViewerTouchEnd = (e) => {
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;

    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    if (absDx > 50 && absDx > absDy) {
      if (dx < 0) showNext();
      else showPrev();
      return;
    }

    if (dy > 80 && absDy > absDx) {
      closeViewer();
    }
  };

  if (loading)
    return (
      <div className="flex justify-center py-20 text-gray-500 text-xl">
        Loading tasks...
      </div>
    );

  return (
    <div>
      <StaffHeader name={firstName} />

      {/* 🔵 IMAGE VIEWER MODAL WITH GALLERY, ZOOM, SWIPE, DRAG-CLOSE */}
      <AnimatePresence>
        {viewerOpen && (
          <motion.div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-[999]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeViewer}
            onTouchStart={handleViewerTouchStart}
            onTouchEnd={handleViewerTouchEnd}
          >
            {/* Close button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeViewer();
              }}
              className="absolute top-6 right-6 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full backdrop-blur-md transition"
            >
              <XCircle size={28} />
            </button>

            {/* Prev / Next arrows */}
            {viewerImages.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    showPrev();
                  }}
                  className="absolute left-4 md:left-8 text-white bg-black/30 hover:bg-black/60 p-2 rounded-full"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    showNext();
                  }}
                  className="absolute right-4 md:right-8 text-white bg-black/30 hover:bg-black/60 p-2 rounded-full"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}

            {/* Image container */}
            <motion.div
              className="max-h-[90vh] max-w-[90vw] flex items-center justify-center"
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              onClick={(e) => e.stopPropagation()}
            >
              {viewerImages[viewerIndex] && (
                <img
                  src={viewerImages[viewerIndex]}
                  className="max-h-[90vh] max-w-[90vw] rounded-xl shadow-xl"
                  style={{ transform: `scale(${viewerZoom})` }}
                />
              )}
            </motion.div>

            <div
              className="absolute bottom-6 flex items-center gap-3 bg-black/60 text-white px-4 py-2 rounded-full text-xs md:text-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="flex items-center gap-1 px-2"
                onClick={zoomOut}
              >
                <ZoomOut size={16} /> -
              </button>
              <span className="px-2 border-x border-white/40">
                {Math.round(viewerZoom * 100)}%
              </span>
              <button
                className="flex items-center gap-1 px-2"
                onClick={zoomIn}
              >
                <ZoomIn size={16} /> +
              </button>
              <button
                className="px-2 underline text-xs"
                onClick={resetZoom}
              >
                Reset
              </button>
              {viewerImages.length > 1 && (
                <span className="ml-2 opacity-80">
                  {viewerIndex + 1} / {viewerImages.length}
                </span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {rejectModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full">
              <h2 className="text-lg font-bold flex items-center gap-2 mb-3">
                <XCircle className="text-red-600" /> Reject Task
              </h2>
              <textarea
                className="w-full border p-3 rounded-lg"
                rows="4"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Enter rejection reason..."
              />
              <div className="flex justify-end gap-2 mt-3">
                <button
                  onClick={() => setRejectModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg"
                >
                  Submit
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {completeModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div className="bg-white p-6 rounded-xl max-w-md w-full">
              <h3 className="text-lg font-bold flex items-center gap-2 mb-3">
                <CheckCircle className="text-green-600" /> Mark as Completed
              </h3>
              <p className="text-sm text-gray-700">
                Confirm marking this task as completed?
              </p>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  className="px-4 py-2 bg-gray-200 rounded-lg"
                  onClick={() => setCompleteModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    await updateStatus(selectedCompleteTaskId, "Completed");
                    setCompleteModalOpen(false);
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-6 max-w-6xl mx-auto">
        <div className="relative mb-8">
          <div className="backdrop-blur-md bg-gray-900 border border-white/20 
      shadow-xl rounded-2xl px-8 py-6 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-400/40 to-blue-600/40 
        shadow-inner">
              <ClipboardList className="text-blue-100" size={28} />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-white drop-shadow">
                My Assigned Tasks
              </h1>
              <p className="text-blue-100/80 text-sm mt-1">
                Manage and update your ongoing work.
              </p>
            </div>
          </div>
        </div>


        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {tasks.map((task) => {
            const progress = getProgressPercent(task);

            return (
              <motion.div
                key={task._id}
                className="bg-white p-5 rounded-xl shadow hover:shadow-lg border border-gray-200"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {/* HEADER */}
                <h2 className="text-xl font-bold">
                  {task.requestId?.taskType}
                </h2>
                <p className="text-gray-500">{task.requestId?.category}</p>

                {/* DETAILS */}
                <div className="bg-gray-100 p-3 rounded mt-3">
                  <p className="font-semibold text-sm flex items-center gap-1">
                    <FileText size={16} /> Details
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {task.requestId?.requestDetails}
                  </p>
                </div>

                {/* PROGRESS BAR */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-2 bg-gradient-to-r from-blue-500 to-green-500 transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {task.assignedStatus !== "Pending" && (
                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    {["In Progress", "Pending", "Completed"].map((status) => {
                      const isActive = task.status === status;

                      // 🔒 DISABLE LOGIC
                      const isDisabled =
                        (task.status === "In Progress" && status === "Completed") ||
                        (task.status === "Pending" && status === "In Progress") ||
                        (task.status === "Completed" && (status === "In Progress" || status === "Pending"));

                      const baseClasses =
                        "px-3 py-1 rounded-full border transition";

                      let activeClasses = "";
                      let inactiveClasses = "";
                      let disabledClasses = "opacity-40 cursor-not-allowed";

                      if (status === "In Progress") {
                        activeClasses = "bg-yellow-500 text-white border-yellow-600 shadow";
                        inactiveClasses = "text-yellow-700 border-yellow-300 hover:bg-yellow-50";
                      } else if (status === "Pending") {
                        activeClasses = "bg-blue-600 text-white border-blue-700 shadow";
                        inactiveClasses = "text-blue-700 border-blue-300 hover:bg-blue-50";
                      } else {
                        activeClasses = "bg-green-600 text-white border-green-700 shadow";
                        inactiveClasses = "text-green-700 border-green-300 hover:bg-green-50";
                      }

                      return (
                        <button
                          key={status}
                          type="button"
                          disabled={isDisabled}
                          className={`${baseClasses} 
                          ${isActive ? activeClasses : inactiveClasses} 
                          ${isDisabled ? disabledClasses : ""}`}
                          onClick={() => !isDisabled && handleStatusClick(task, status)}
                        >
                          {status}
                        </button>
                      );
                    })}

                  </div>
                )}

                {/* UPLOAD UI */}
                <div className="mt-4">
                  <p className="text-xs font-semibold mb-1">
                    Upload Proof Images:
                  </p>

                  <label
                    htmlFor={`upload-${task._id}`}
                    className="h-28 flex flex-col items-center justify-center w-full border-2 border-dashed border-blue-400 rounded-xl bg-blue-50 hover:bg-blue-100 cursor-pointer transition"
                  >
                    <ImageIcon className="text-blue-500 mb-1" />
                    <span className="text-blue-600 font-medium text-sm">
                      Click or Drag images
                    </span>
                  </label>

                  <input
                    id={`upload-${task._id}`}
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      handleMultipleProofs(task._id, e.target.files)
                    }
                  />

                  {/* UPLOADING LOADING */}
                  {uploadingTaskId === task._id && (
                    <div className="flex items-center gap-2 text-blue-500 mt-2">
                      <Loader2 className="animate-spin" size={18} />
                      <span className="text-xs">Uploading...</span>
                    </div>
                  )}

                  {/* LOCAL PREVIEW */}
                  {previewImages[task._id] &&
                    previewImages[task._id].length > 0 && (
                      <div className="grid grid-cols-4 gap-2 mt-3">
                        {previewImages[task._id].map((src, i) => (
                          <img
                            key={i}
                            src={src}
                            className="rounded-lg border shadow object-cover h-20"
                          />
                        ))}
                      </div>
                    )}
                </div>

                {/* DISPLAY UPLOADED */}
                {task.proofUrls && task.proofUrls.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-semibold mb-1">
                      Uploaded Proof Images:
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {task.proofUrls.map((url, i) => (
                        <motion.img
                          key={i}
                          src={url}
                          className="h-24 w-full object-cover rounded-xl shadow cursor-pointer hover:scale-105 transition"
                          onClick={() => openViewer(task.proofUrls, i)}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* ACCEPT / REJECT or STATUS CONTROLS */}
                <div className="mt-4 flex gap-3">
                  {task.assignedStatus === "Pending" ? (
                    <>
                      <button
                        className="flex-1 bg-green-600 text-white py-2 rounded-lg"
                        onClick={() => handleAccept(task._id)}
                      >
                        Accept
                      </button>
                      <button
                        className="flex-1 bg-red-600 text-white py-2 rounded-lg"
                        onClick={() => {
                          setSelectedTaskId(task._id);
                          setRejectModalOpen(true);
                        }}
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <></>
                  )}
                </div>

                {/* LOG */}
                <div className="mt-4 border-t pt-3 text-xs text-gray-600">
                  <p className="font-semibold flex items-center gap-1">
                    <Activity size={14} /> Activity Log
                  </p>
                  <p>
                    • Assigned:{" "}
                    <strong>
                      {new Date(task.createdAt).toLocaleString()}
                    </strong>
                  </p>

                  {task.startDate && (
                    <p>
                      • Started:{" "}
                      <strong>
                        {new Date(task.startDate).toLocaleString()}
                      </strong>
                    </p>
                  )}

                  {task.endDate && (
                    <p>
                      • Completed:{" "}
                      <strong>
                        {new Date(task.endDate).toLocaleString()}
                      </strong>
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TodoWorks;
