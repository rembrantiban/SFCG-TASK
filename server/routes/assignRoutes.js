import express from "express";
import { assignToUser, 
         getUserTasks, 
         getWeeklyMetrics, 
         getAssignStats, 
         rejectAssignedTask, 
         acceptAssignedTask, 
         reassignTask, 
         getTaskByRequest , 
        getAllAssignedTasks,
        updateTaskStatus,
        saveProofUrls,
        uploadMultipleProofs,
        getAllAssigned,
        getMonthlyTaskChart,
        getTaskStats,
    } from "../Controller/assignController.js";
import { upload } from "../lib/multer.js";

const router = express.Router();

router.post("/assign-user", assignToUser);
router.get("/usertasks/:userId", getUserTasks);
router.get("/weekly-metrics", getWeeklyMetrics);
router.get("/totalassigned", getAssignStats);  
router.put("/accept/:taskId", acceptAssignedTask);
router.put("/reject/:taskId", rejectAssignedTask);
router.patch("/reassign/:taskId", reassignTask);
router.get("/get-by-request/:id" , getTaskByRequest);
router.get("/all", getAllAssignedTasks);
router.put("/status/:id", updateTaskStatus);
router.post("/upload", upload.array("images", 10),uploadMultipleProofs);
router.put("/proof/:taskId", saveProofUrls);
router.get("/assignlist", getAllAssigned);
router.get("/stats/:userId", getTaskStats);
router.get("/monthly/:userId", getMonthlyTaskChart);

export default router;
