import express from "express";
import { createRequest,
         getMyRequests,
         totalRequestCount,
         getAllUnnotedRequests,
         getAllUnapprovedRequests,
         markAsNoted,
         markAsApproved,
         updateRequestRejectStatus,
         getAllRequests,
         rejectUserRequest,
         cancelRequest,
 } from "../Controller/requestController.js";
import {
     verifyToken,
     } from "../middleware/auth.js";


const requestRouter = express.Router();

requestRouter.post("/create", verifyToken, createRequest);
requestRouter.get("/my-requests", verifyToken, getMyRequests);
requestRouter.get("/count", totalRequestCount )
requestRouter.get("/getallunoted", getAllUnnotedRequests)
requestRouter.get("/getallunapproved", getAllUnapprovedRequests)
requestRouter.put("/noted/:id", verifyToken, markAsNoted)
requestRouter.put("/markAsApproved/:id", verifyToken, markAsApproved)
requestRouter.put("/update-reject/:requestId", updateRequestRejectStatus);
requestRouter.get("/all", getAllRequests);
requestRouter.patch("/reject/:requestId", rejectUserRequest);
requestRouter.delete("/cancel/:requestId", cancelRequest);






export default requestRouter;
