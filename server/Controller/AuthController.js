import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";


export const register = async (req, res) => {
  const { firstName, lastName, idNumber, password, role, department, category } = req.body;

  if (!firstName || !lastName || !idNumber || !password || !department || !category) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const idNumberRegex = /^\d{3}-\d{4}$/;
  if (!idNumberRegex.test(idNumber)) {
    return res.status(400).json({ message: "Invalid ID Number format" });
  }

  if (password.length < 10) {
    return res.status(400).json({ message: "Password must be at least 10 characters" });
  }

  try {
    const existingUser = await userModel.findOne({ idNumber });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const userRole = role?.trim() || "Staff";

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({
      firstName,
      lastName,
      idNumber,
      department,
      category,        // <===== REQUIRED FIELD (FIXED)
      password: hashedPassword,
      role: userRole,
    });

    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        department: newUser.department,
        category: newUser.category,   // <=== RETURN CATEGORY
        idNumber: newUser.idNumber,
        role: newUser.role,
      },
      token,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during registration",
    });
  }
};

export const Login = async (req, res) => {
  const { idNumber, password } = req.body;

  if (!idNumber || !password) {
    return res.status(400).json({ message: "ID Number and password are required" });
  }

  try {
    const user = await userModel.findOne({ idNumber });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID Number or password",
      });
    }

    if (!user.isApproved) {
      return res.status(403).json({
        success: false,
        message: "Your account is not yet approved. Please contact the administrator.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID or password",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        idNumber: user.idNumber,
        department: user.department,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      expires: new Date(0), 
    });

    res.setHeader("Authorization", "");

    return res.status(200).json({
      success: true,
      isAuthenticated: false,
      message: "Logout successful",
    });

  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during logout",
    });
  }
};


export const getAllNonAdminUsers = async (req, res) => {
  try {
    const users = await userModel.find({ role: { $ne: "Admin" } }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      users
    });

  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


export const totalUsersCount = async (req, res) => {
  try {  
    const totalUsers = await userModel.countDocuments({});
    return res.status(200).json({
      success: true,
      message: "User count fetched successfully",
      totalUsers
    });
  } catch (error) {
    console.error("Error fetching user count:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


export const updateUserIsApproved = async (req, res) => {
  try {
    const { id } = req.params;
    const { isApproved } = req.body;

    if (typeof isApproved !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "Invalid 'isApproved' value. Expected boolean.",
      });
    }

    const user = await userModel.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user.isApproved === isApproved) {
      return res.status(200).json({
        success: true,
        message: `User is already ${isApproved ? "approved" : "disapproved"}.`,
        user,
      });
    }

    user.isApproved = isApproved;
    await user.save();

    return res.status(200).json({
      success: true,
      message: `User ${isApproved ? "approved" : "disapproved"} successfully.`,
      user,
    });

  } catch (error) {
    console.error("Error updating user approval:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role.toLowerCase() === "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin accounts cannot be deleted",
      });
    }

    await userModel.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
      deletedUser: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        idNumber: user.idNumber,
        role: user.role,
      }
    });

  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while deleting user",
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      firstName,
      lastName,
      idNumber,
      password,
      role,
      isApproved,
      department,
      category,
    } = req.body;

    const updateData = {};

    // VALIDATIONS
    if (idNumber) {
      const idNumberRegex = /^\d{3}-\d{4}$/;
      if (!idNumberRegex.test(idNumber)) {
        return res.status(400).json({
          success: false,
          message: "Invalid ID Number format (expected ###-####)",
        });
      }
      updateData.idNumber = idNumber;
    }

    // UPDATE FIELDS IF PROVIDED
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;

    if (department) updateData.department = department;

    if (category) updateData.category = category;

    if (typeof isApproved === "boolean") updateData.isApproved = isApproved;

    if (role && role.trim() !== "") updateData.role = role.trim();

    if (password && password.trim() !== "") {
      if (password.length < 10) {
        return res.status(400).json({
          success: false,
          message: "Password must be at least 10 characters",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    // UPDATE USER
    const updatedUser = await userModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: {
        id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        idNumber: updatedUser.idNumber,
        department: updatedUser.department,
        category: updatedUser.category,
        role: updatedUser.role,
        isApproved: updatedUser.isApproved,
      },
    });

  } catch (error) {
    console.error("Update user error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during update",
    });
  }
};


export const updateAdminProfile = async (req, res) => {
  try {
    const adminId = req.params.id;
    let updates = { ...req.body };

    delete updates.department;
    delete updates.category;

    if (updates.password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(updates.password, salt);
    }

    const admin = await userModel.findById(adminId);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    const updatedAdmin = await userModel.findByIdAndUpdate(
      adminId,
      updates,
      { new: true }
    ).select("-password");

    return res.status(200).json({
      success: true,
      message: "Admin profile updated successfully",
      user: updatedAdmin,
    });

  } catch (error) {
    console.error("Update Admin Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error updating admin profile",
    });
  }
};



export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await userModel.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });

  } catch (err) {
    console.error("getUserById error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching user",
    });
  }
};




export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    let updates = { ...req.body };

    delete updates.role;
    delete updates.idNumber;

    if (updates.password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(updates.password, salt);
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const updatedUser = await userModel
      .findByIdAndUpdate(userId, updates, { new: true })
      .select("-password");

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    });

  } catch (error) {
    console.error("Update User Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error updating user",
    });
  }
};
