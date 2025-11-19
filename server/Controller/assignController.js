import UserModel from "../models/userModel.js";
import AssignModel from "../models/assignModel.js";
import RequestModel from "../models/requestModel.js";

export const assignToUser = async (req, res) => {
  try {
    const { requestId, assigneeId, createdBy, startDate, endDate } = req.body;

    if (!assigneeId || !requestId) {
      return res.status(400).json({
        success: false,
        message: "assigneeId and requestId are required",
      });
    }

    const assignee = await UserModel.findById(assigneeId);
    if (!assignee) {
      return res.status(404).json({ success: false, message: "Assignee not found" });
    }

    const request = await RequestModel.findById(requestId);
    if (!request) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    if (assignee.category !== request.category) {
      return res.status(400).json({
        success: false,
        message: `User category mismatch. This request requires category "${request.category}".`,
      });
    }

    // Create assignment
    const assignDoc = await AssignModel.create({
      requestId,
      assign: assigneeId,
      createdBy,
      startDate,
      endDate,
      status: "In Progress",
      assignedStatus: "Pending"
    });

    await RequestModel.findByIdAndUpdate(requestId, {
      assignedTo: assigneeId,
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


export const getUserTasks = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const tasks = await AssignModel.find({ assign: userId })
      .populate("requestId")
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