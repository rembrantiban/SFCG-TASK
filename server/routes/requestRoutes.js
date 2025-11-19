import express from "express";
import { createRequest,
         getMyRequests,
         totalRequestCount,
         getAllUnnotedRequests,
         getAllUnAapprovedRequests,
         markAsNoted,
         markAsApproved,
 } from "../Controller/requestController.js";
import {
     verifyToken,
     } from "../middleware/auth.js";


const requestRouter = express.Router();

requestRouter.post("/create", verifyToken, createRequest);
requestRouter.get("/my-requests", verifyToken, getMyRequests);
requestRouter.get("/count", totalRequestCount )
requestRouter.get("/getallunoted", getAllUnnotedRequests)
requestRouter.get("/getallunapproved", getAllUnAapprovedRequests)
requestRouter.put("/noted/:id", verifyToken, markAsNoted)
requestRouter.put("/markAsApproved/:id", verifyToken, markAsApproved)


export default requestRouter;
