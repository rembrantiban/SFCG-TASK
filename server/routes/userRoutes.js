import {
     register,
     Login,
     logout,
     getAllNonAdminUsers,
     updateUserIsApproved,
     deleteUser,
     totalUsersCount,
     updateUser,
     
    } from "../Controller/AuthController.js";
import express from "express"

const Router = express.Router()

    Router.post("/register", register)
    Router.post("/login", Login)
    Router.get("/getalluser", getAllNonAdminUsers)
    Router.post("/logout", logout)
    Router.put("/updateisapproved/:id", updateUserIsApproved);
    Router.delete("/delete/:id", deleteUser)
    Router.get("/totaluserscount", totalUsersCount )
    Router.put("/update/:id", updateUser)
export default Router