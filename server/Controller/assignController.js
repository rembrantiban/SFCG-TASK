import UserModel from "../models/userModel.js";
import AssignModel from "../models/assignModel.js";
import RequestModel from "../models/requestModel.js";
import cloudinary from "../config/cloudinary.js"
import mongoose from "mongoose";
import path from "path";

export const assignToUser = async (req, res) => {
  try {
    const { requestId, assigneeId, startDate, endDate } = req.body;

    if (!assigneeId || !requestId) {
      return res.status(400).json({
        success: false,
        message: "assigneeId and requestId are required",
      });
    }

    const createdBy = req.user._id;

    const assignee = await UserModel.findById(assigneeId);
    if (!assignee) {
      return res.status(404).json({ success: false, message: "Assignee not found" });
    }

    const request = await RequestModel.findById(requestId);
    if (!request) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    if (String(assignee._id) === String(request.requestedBy._id)) {
      return res.status(400).json({
        success: false,
        message: "You cannot assign this request to the same user who requested it.",
      });
    }

    if (assignee.category !== request.category) {
      return res.status(400).json({
        success: false,
        message: `User category mismatch. This request requires category "${request.category}".`,
      });
    }

    const assignDoc = await AssignModel.create({
      requestId,
      assign: assigneeId,
      createdBy,       
      startDate,
      endDate,
      status: "In Progress",
      assignedStatus: "Pending",
    });

    await RequestModel.findByIdAndUpdate(requestId, {
      assignedTo: assigneeId,
      isAssign: true,        
    });

    return res.status(201).json({
      success: true,
      message: "Request assigned successfully",
      assign: assignDoc,
    });

  } catch (err) {
    console.error("assignToUser error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


export const reassignTask = async (req, res) => {
  try {
    const { taskId } = req.params;       
    const { newUserId } = req.body;

    if (!newUserId) {
      return res.status(400).json({
        success: false,
        message: "newUserId is required.",
      });
    }

    const task = await AssignModel.findById(taskId)   
      .populate("requestId")
      .populate("assign");

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Assigned task not found.",
      });
    }

    const user = await UserModel.findById(newUserId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const request = task.requestId;

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found for this task.",
      });
    }

    if (String(newUserId) === String(request.requestedBy)) {
      return res.status(400).json({
        success: false,
        message: "Cannot assign task to the user who created the request.",
      });
    }

    if (String(task.assign?._id) === String(newUserId)) {
      return res.status(400).json({
        success: false,
        message: "This user is already assigned to this task.",
      });
    }

    if (
      task.assignedStatus === "Rejected" &&
      String(task.assign?._id) === String(newUserId)
    ) {
      return res.status(400).json({
        success: false,
        message: "This user has already rejected the task and cannot be reassigned.",
      });
    }

    if (user.category !== request.category) {
      return res.status(400).json({
        success: false,
        message: `User category mismatch. This task requires "${request.category}".`,
      });
    }

    task.assign = newUserId;
    task.assignedStatus = "Pending";
    task.rejectReason = "";
    task.startDate = null;

    await task.save();

    return res.status(200).json({
      success: true,
      message: "Task reassigned successfully!",
      task,
    });

  } catch (error) {
    console.error("Reassign error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while reassigning task.",
    });
  }
};


export const getUserTasks = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId || userId === "undefined" || userId === "null") {
      return res.status(400).json({
        success: false,
        message: "Valid user ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      });
    }

    const tasks = await AssignModel.find({
      assign: new mongoose.Types.ObjectId(userId),
      assignedStatus: { $ne: "Rejected" },
    })
      .populate({
        path: "requestId",
        select:
          "taskType category requestDetails urgency requestedDate approvedDate notedDate requestedBy",
        populate: {
          path: "requestedBy",
          select: "firstName lastName",
        },
      })
      .populate("assign", "firstName lastName")
      .populate("createdBy", "firstName lastName");

    return res.status(200).json({
      success: true,
      tasks,
    });
  } catch (err) {
    console.error("getUserTasks error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


export const getWeeklyMetrics = async (req, res) => {
  try {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const today = new Date();

    const results = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);

      const start = new Date(date.setHours(0,0,0,0));
      const end = new Date(date.setHours(23,59,59,999));

      const usersCount = await UserModel.countDocuments({
        createdAt: { $gte: start, $lte: end }
      });

      const tasksCount = await AssignModel.countDocuments({
        createdAt: { $gte: start, $lte: end }
      });

      const requestsCount = await RequestModel.countDocuments({
        requestedDate: { $gte: start, $lte: end }
      });

      const assignCount = await AssignModel.countDocuments({
        createdAt: { $gte: start, $lte: end }
      });

      results.push({
        name: days[date.getDay()],
        users: usersCount,
        tasks: tasksCount,
        requests: requestsCount,
        assign: assignCount
      });
    }

    return res.status(200).json({
      success: true,
      metrics: results
    });

  } catch (err) {
    console.error("Metrics Error:", err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

export const getAssignStats = async (req, res) => {
  try {
    const totalAssigned = await AssignModel.countDocuments();

    const totalCompleted = await AssignModel.countDocuments({ status: "Completed" });

    res.status(200).json({
      success: true,
      totalAssigned,
      totalCompleted,
    });

  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

export const acceptAssignedTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const updated = await AssignModel.findByIdAndUpdate(
      taskId,
      {
        assignedStatus: "Accepted",
        startDate: new Date(),
        rejectReason: ""
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Task accepted successfully",
      task: updated,
    });
  } catch (err) {
    console.error("acceptAssignedTask error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


export const rejectAssignedTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { rejectReason } = req.body;

    if (!rejectReason || rejectReason.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Reject reason is required",
      });
    }

    const updated = await AssignModel.findByIdAndUpdate(
      taskId,
      {
        assignedStatus: "Rejected",
        rejectReason,
        endDate: new Date(), 
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Task rejected successfully",
      task: updated,
    });
  } catch (err) {
    console.error("rejectAssignedTask error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


export const getTaskByRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    const task = await AssignModel.findOne({ requestId })
      .populate("requestId");

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "No assigned task found for this request",
      });
    }

    return res.status(200).json({
      success: true,
      task,
    });
  } catch (err) {
    console.error("getTaskByRequest error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getAllAssignedTasks = async (req, res) => {
  try {
    const tasks = await AssignModel
      .find()
      .populate({
        path: "requestId",
        select: "taskType category requestDetails urgency requestedBy",
        populate: {
          path: "requestedBy",
          select: "firstName lastName",
        },
      })
      .populate("assign", "firstName lastName department category")
      .populate("createdBy", "firstName lastName");

    return res.status(200).json({
      success: true,
      tasks,
    });

  } catch (error) {
    console.error("Get Assigned Tasks Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching assigned tasks",
    });
  }
};

export const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    console.log("STATUS RECEIVED:", status);
    console.log("TASK ID RECEIVED:", id);

    if (!["Pending", "In Progress", "Completed"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const task = await AssignModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    return res.json({
      success: true,
      message: "Task status updated successfully",
      task,
    });

  } catch (error) {
    console.error("UPDATE STATUS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error updating task status",
    });
  }
};


export const uploadMultipleProofs = async (req, res) => {
  try {
    const uploadedUrls = [];

    for (let file of req.files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "assign_proofs",
      });
      uploadedUrls.push(result.secure_url);
    }

    return res.json({
      success: true,
      urls: uploadedUrls,
    });

  } catch (err) {
    return res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
};

export const saveProofUrls = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { urls } = req.body; 
    const updated = await AssignModel.findByIdAndUpdate(
      taskId,
      {
        $push: { proofUrls: { $each: urls } }
      },
      { new: true }
    );

    res.json({ success: true, task: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAllAssigned = async (req, res) => {
  try {
    const assigned = await AssignModel
      .find()
      .populate("requestId")                         
      .populate("assign", "firstName lastName department") 
      .populate("createdBy", "firstName lastName departmen")   
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      assignedTasks: assigned,
    });

  } catch (err) {
    console.error("getAllAssignedTasks error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getAllCompletedAssigned = async (req, res) => {
  try {
    const completedTasks = await AssignModel
      .find({ status: "Completed" })
      .populate("requestId")
      .populate("userId")
      .populate("assign")
      .populate("createdBy");

    return res.status(200).json({
      success: true,
      message: "Completed tasks fetched successfully",
      tasks: completedTasks,
    });

  } catch (error) {
    console.error("Error fetching completed tasks:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
export const getUserRecords = async (req, res) => {
  try {

    const records = await AssignModel
      .find({ status: "Completed" })   
      .populate({
        path: "requestId",
        select: "taskType category requestDetails urgency requestedBy approvedBy notedBy",
        populate: [
          {
            path: "requestedBy",
            select: "firstName lastName",
          },
          {
            path: "approvedBy",
            select: "firstName lastName",
          },
          {
            path: "notedBy",
            select: "firstName lastName",
          }
        ],  
      })
      .populate("assign", "firstName lastName department category")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      records,
    });

  } catch (error) {
    console.error("Error fetching records:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching record data",
    });
  }
};


export const getTaskStats = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID"
      });
    }

    const objectId = new mongoose.Types.ObjectId(userId);

    const assigned = await AssignModel.countDocuments({ userId: objectId });
    const completed = await AssignModel.countDocuments({ userId: objectId, status: "Completed" });
    const pending = await AssignModel.countDocuments({
      userId: objectId,
      status: { $in: ["Pending", "In Progress"] }
    });

    res.status(200).json({
      success: true,
      stats: { assigned, completed, pending }
    });

  } catch (error) {
    console.error("Error getting task stats:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

export const getMonthlyTaskChart = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID"
      });
    }

    const objectId = new mongoose.Types.ObjectId(userId);

    const result = await AssignModel.aggregate([
      { $match: { userId: objectId } },

      {
        $group: {
          _id: { month: { $month: "$createdAt" } },
          assigned: { $sum: 1 },
          completed: {
            $sum: {
              $cond: [{ $eq: ["$status", "Completed"] }, 1, 0]
            }
          }
        }
      },

      { $sort: { "_id.month": 1 } }
    ]);

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const formatted = result.map(r => ({
      month: months[r._id.month - 1],
      assigned: r.assigned,
      completed: r.completed
    }));

    res.status(200).json({
      success: true,
      chart: formatted
    });

  } catch (error) {
    console.error("Monthly task error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};