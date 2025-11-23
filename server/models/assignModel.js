import mongoose from "mongoose";
import { ref } from "process";

const assignSchema = new mongoose.Schema({
  requestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Request",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  status: {   
    type: String,
    enum: ['Pending', 'In Progress', 'Completed'],
    default: 'Pending',
    required: true,
  },

   proofUrls: [
    {
      type: String,
    }
  ],

  assign: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },

  isWorking: {
    type: Boolean,
    default: false,
  },

  markAsCompleted: {
    type : Boolean,
    default: false,
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },

  startDate: Date,
  endDate: Date,

  rejectReason: {
    type: String,
    default: "",
  },

  assignedStatus: { 
    type: String, 
    enum: ['Pending', 'Accepted', 'Rejected'], 
    default: 'Pending' 
  },

  comments: [
    {
      text: { type: String, required: true },
      commentedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      createdAt: { type: Date, default: Date.now },
    },
  ],

}, { timestamps: true }); 


const assignModel = mongoose.model("AssignTask", assignSchema)

export default assignModel