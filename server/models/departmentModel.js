import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema(
  {
    departmentName: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    categories: {
      type: [String],   
      default: []
    }
  },
  { timestamps: true }
);

const DepartmentModel = mongoose.model("Department", departmentSchema);
export default DepartmentModel;
