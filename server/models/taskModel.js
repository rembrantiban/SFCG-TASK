import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    taskName: {
      type: String,
      required: true,
    },
    taskdescription: {
      type: String,
    },
  },
  { timestamps: true }
);

const taskModel = mongoose.model("Task", taskSchema);
export default taskModel;
