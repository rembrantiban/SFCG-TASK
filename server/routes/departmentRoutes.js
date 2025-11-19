import {
    getAllDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    addCategoryToDepartment,
    getDepartmentWithCategories,
} from "../Controller/departmentController.js"

import express, { Router } from "express"

const departmentRouter = express.Router()

 departmentRouter.post("/create", createDepartment);
 departmentRouter.put("/updatedepartment/:id", updateDepartment)
 departmentRouter.get("/getalldepartment", getAllDepartments)
 departmentRouter.delete("/deletedepartment/:id", deleteDepartment)
 departmentRouter.put("/addcategory/:id", addCategoryToDepartment);
 departmentRouter.get("getalldepartmentandcategories", getDepartmentWithCategories)


 export default departmentRouter