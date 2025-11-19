import express from "express";
import { assignToUser, getUserTasks, getWeeklyMetrics, getAssignStats } from "../Controller/assignController.js";

const router = express.Router();

router.post("/assign-user", assignToUser);
router.get("/usertasks/:userId", getUserTasks);
router.get("/weekly-metrics", getWeeklyMetrics);
router.get("/totalassigned", getAssignStats);  


export default router;
