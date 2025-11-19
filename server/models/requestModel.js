import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
  {
    taskType: {
      type: String,
      required: true,
      trim: true,
    },


    category: {
      type: String,
      enum: ["Carpentry", "Electrical", "Painting", "Plumbing", "Others"],
      required: true,
    },

    otherCategory: {
      type: String,
      trim: true,
    },

    requestDetails: {
      type: String,
      default: "",
      trim: true,
    },

    urgency: {
      type: String,
      enum: ["Emergency", "One Day", "This Week", "When Possible"],
      default: "When Possible",
    },

    requestedDate: {
      type: Date,
      default: Date.now,
    },

    notedDate: {
      type: Date,
    },

    approvedDate: {
      type: Date,
    },
    isApproved:{
       type: Boolean,
       default: false,

    },
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,  
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    notedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    status: {
      type: String,
      enum: ["Pending", "Noted", "Approved", "Completed", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

requestSchema.pre("validate", function (next) {
  if (this.department === "Other" && !this.otherDepartment) {
    this.invalidate("otherDepartment", "Other department name is required.");
  }
  if (this.category === "Others" && !this.otherCategory) {
    this.invalidate("otherCategory", "Other category name is required.");
  }
  next();
});

const requestModel = mongoose.model("Request", requestSchema);

export default requestModel;
