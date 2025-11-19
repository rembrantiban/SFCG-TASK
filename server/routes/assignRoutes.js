import express from "express";
import { assignToUser, getUserTasks, getWeeklyMetrics } from "../Controller/assignController.js";

const router = express.Router();

router.post("/assign-user", assignToUser);
router.get("/usertasks/:userId", getUserTasks);
router.get("/weekly-metrics", getWeeklyMetrics);


export default router;
