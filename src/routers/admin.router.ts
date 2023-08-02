import express from "express";
import UsersManagerController from "../controllers/admincontroller/userManager.controller";
const adminApiRouter = express.Router()

adminApiRouter.get('/users',(req,res)=>{
    UsersManagerController.getUserList(req,res)
})

export default adminApiRouter
