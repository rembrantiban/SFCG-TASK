import requestModel from "../models/requestModel.js";
import userModel from "../models/userModel.js";
import AssignModel from "../models/assignModel.js";

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
      .find({
        notedBy: { $ne: null },              
        approvedBy: { $in: [null, undefined] }  
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

export const getAllUnapprovedRequests = async (req, res) => {
  try {
    const requests = await requestModel
      .find({ isAssign: false })
      .populate("requestedBy", "firstName lastName department")
      .populate("approvedBy", "firstName lastName")
      .populate("notedBy", "firstName lastName")
      .sort({ createdAt: -1 });

      const requestsWithAssignStatus = await Promise.all(
      requests.map(async (req) => {
        const assign = await AssignModel.findOne({ requestId: req._id });

        return {
          ...req.toObject(),
          assignedStatus: assign?.assignedStatus || "Pending",
          rejectReason: assign?.rejectReason || "",
        };
      })
    );

    return res.status(200).json({
      success: true,
      requests: requestsWithAssignStatus,
    });
  } catch (error) {
    console.error("getAllUnapprovedRequests error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
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
    const { id } = req.params; // requestId
    const userId = req.user.id; // approver ID

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized — user not logged in",
      });
    }

    const updatedRequest = await requestModel
      .findByIdAndUpdate(
        id,
        {
          approvedBy: userId,
          approvedDate: new Date(),
          status: "Approved",
        }, 
        { new: true }
      )
      .populate("requestedBy", "firstName lastName department");

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
    console.log("APPROVE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while updating request",
    });
  }
};



export const updateRequestRejectStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { isReject } = req.body; 

    if (typeof isReject !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isReject must be true or false",
      });
    }

    const updated = await requestModel.findByIdAndUpdate(
      requestId,
      { isReject },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "isReject updated successfully",
      request: updated,
    });

  } catch (err) {
    console.error("updateRequestRejectStatus error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getAllRequests = async (req, res) => {
  try {
    const requests = await requestModel
      .find()
      .sort({ createdAt: -1 }) 
      .populate("requestedBy", "firstName lastName department category role")
      .populate("approvedBy", "firstName lastName")
      .populate("notedBy", "firstName lastName");

    return res.status(200).json({
      success: true,
      requests,
    });

  } catch (err) {
    console.error("Get All Requests Error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching requests",
    });
  }
};


export const rejectUserRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    const request = await requestModel.findById(requestId);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found.",
      });
    }

    if (request.isReject === true) {
      return res.status(400).json({
        success: false,
        message: "This request is already rejected.",
      });
    }

    request.rejectRequest = true;
    request.isReject = true;

    await request.save();

    return res.status(200).json({
      success: true,
      message: "Request has been successfully rejected.",
      data: request,
    });

  } catch (error) {
    console.error("Reject Request Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while rejecting request.",
    });
  }
};

export const cancelRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    const deleted = await requestModel.findByIdAndDelete(requestId);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Request not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Request successfully cancelled (deleted).",
    });

  } catch (error) {
    console.error("Cancel Request Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while cancelling the request.",
    });
  }
};
