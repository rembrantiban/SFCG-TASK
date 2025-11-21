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
        updateTaskStatus
    } from "../Controller/assignController.js";

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





export default router;
