import requestModel from "../models/requestModel.js";
import userModel from "../models/userModel.js";

export const createRequest = async (req, res) => {
  try {
    const {
      taskType,
      category,
      otherCategory,
      requestDetails,
      urgency,
    } = req.body;

    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized request — user not authenticated",
      });
    }

    if (!taskType || !category || !requestDetails || !urgency) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields",
      });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Requesting user not found",
      });
    }

    const newRequest = await requestModel.create({
      taskType,
      category,
      otherCategory: category === "Others" ? otherCategory : null,
      requestDetails,
      urgency,
      requestedBy: userId,
      status: "Pending",
    });

    return res.status(201).json({
      success: true,
      message: "Work order request submitted successfully",
      data: newRequest,
    });

  } catch (error) {
    console.error("CREATE REQUEST ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error while submitting request",
    });
  }
};

export const getMyRequests = async (req, res) => {
  try {
    const userId = req.user.id; 
    const requests = await requestModel
      .find({ requestedBy: userId })
       .populate("approvedBy", "firstName lastName department")
      .populate("notedBy", "firstName lastName")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    console.error("GET REQUEST ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching requests",
    });
  }
};

export const totalRequestCount = async (req, res) => {
  try {
    const totalRequests = await requestModel.countDocuments({});
    
    return res.status(200).json({
      success: true,
      message: "Request count fetched successfully",
      totalRequests,
    });
  } catch (error) {
    console.error("Error fetching request count:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getAllUnnotedRequests = async (req, res) => {
  try {
    const requests = await requestModel
      .find()
      .populate("requestedBy", "firstName lastName department")
      .populate("approvedBy", "firstName lastName")
      .populate("notedBy", "firstName lastName")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Unnoted requests fetched successfully",
      requests,
    });
  } catch (error) {
    console.error("Fetch unnoted requests error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getAllUnAapprovedRequests = async (req, res) => {
  try {
    const requests = await requestModel
      .find({
        $or: [{ approvedBy: null }, { approvedBy: { $exists: false } }]
      })
      .populate("requestedBy", "firstName lastName department")
      .populate("approvedBy", "firstName lastName")
      .populate("notedBy", "firstName lastName")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Unnoted requests fetched successfully",
      requests,
    });
  } catch (error) {
    console.error("Fetch unnoted requests error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const markAsNoted = async (req, res) => {
  try {
    const { id } = req.params;         
    const userId = req.user.id;       

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized — user not logged in",
      });
    }

    const updatedRequest = await requestModel.findByIdAndUpdate(
      id,
      {
        notedBy: userId,
        notedDate: Date.now(),
        status: "Noted",
        isApproved: false,
      },
      { new: true }
    ).populate("requestedBy", "firstName lastName department");

    if (!updatedRequest) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Request successfully marked as NOTED",
      request: updatedRequest,
    });

  } catch (error) {
    console.log("NOTED ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while updating request",
    });
  }
};

export const markAsApproved = async (req, res) => {
  try {
    const { id } = req.params;         
    const userId = req.user.id;       

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized — user not logged in",
      });
    }

    const updatedRequest = await requestModel.findByIdAndUpdate(
      id,
      {
        approvedBy: userId,
        approvedDate: Date.now(),
        status: "Approved"
      },
      { new: true }
    ).populate("requestedBy", "firstName lastName department");

    if (!updatedRequest) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Request successfully marked as Approved",
      request: updatedRequest,
    });

  } catch (error) {
    console.log("NOTED ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while updating request",
    });
  }
};