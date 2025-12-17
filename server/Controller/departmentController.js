import DepartmentModel from "../models/departmentModel.js";

export const createDepartment = async (req, res) => {
  try {
    const { departmentName } = req.body;

    if (!departmentName) {
      return res.status(400).json({ success: false, message: "Department name is required" });
    }

    const existing = await DepartmentModel.findOne({ departmentName });

    if (existing) {
      return res.status(400).json({ success: false, message: "Department already exists" });
    }

    const department = await DepartmentModel.create({ departmentName });

    return res.status(201).json({ success: true, message: "Department created", department });
  } catch (error) {
    console.error("Create Department Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getAllDepartments = async (req, res) => {
  try {
    const departments = await DepartmentModel.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Departments fetched successfully",
      departments,
    });
  } catch (error) {
    console.error("Get Departments Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getAllNonTeacherDepartments = async (req, res) => {
  try {
    const departments = await DepartmentModel.find().lean()
      .sort({ createdAt: -1 });

    const cleanedDepartments = departments.map((dept) => ({
      ...dept,
      categories: dept.categories.filter(
        (cat) => !/^teacher(s)?$/i.test(cat)
      ),
    }));

    return res.status(200).json({
      success: true,
      message: "Departments fetched successfully",
      departments: cleanedDepartments,
    });
  } catch (error) {
    console.error("Get Departments Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


export const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { departmentName } = req.body;

    const updated = await DepartmentModel.findByIdAndUpdate(
      id,
      { departmentName },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Department not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Department updated",
      department: updated,
    });
  } catch (error) {
    console.error("Update Department Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await DepartmentModel.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Department not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Department deleted",
      department: deleted,
    });
  } catch (error) {
    console.error("Delete Department Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const addCategoryToDepartment = async (req, res) => {
  try {
    const { id } = req.params;     
    const { category } = req.body;  

    if (!category) {
      return res.status(400).json({ success: false, message: "Category is required" });
    }

    const department = await DepartmentModel.findById(id);
    if (!department) {
      return res.status(404).json({ success: false, message: "Department not found" });
    }

    if (department.categories.includes(category)) {
      return res.status(400).json({ 
        success: false, 
        message: "Category already exists in this department" 
      });
    }

    department.categories.push(category);
    await department.save();

    return res.status(200).json({
      success: true,
      message: "Category added successfully",
      department
    });

  } catch (error) {
    console.error("Add Category Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


export const getDepartmentWithCategories = async (req, res) => {
  try {
    const { id } = req.params;

    const department = await DepartmentModel.findById(id).select(
      "departmentName categories"
    );

    if (!department) {
      return res
        .status(404)
        .json({ success: false, message: "Department not found" });
    }

    return res.status(200).json({
      success: true,
      departmentName: department.departmentName,
      categories: department.categories
    });
  } catch (error) {
    console.error("Get Department & Categories Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
