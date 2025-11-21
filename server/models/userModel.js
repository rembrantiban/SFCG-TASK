import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    idNumber:{ type: String, required: true, unique: true},
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true },
    department: {type: String, required: true},
    category :{ type: String, required: true},
    role: { type: String,  required: true },
    isApproved: { default: false, type: Boolean}
  },
  { timestamps: true } 
);

const userModel = mongoose.model('User', userSchema);
export default userModel;
