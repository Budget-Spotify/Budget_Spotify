import express from "express";
import UsersManagerController from "../controllers/admincontroller/userManager.controller";
const adminApiRouter = express.Router()

adminApiRouter.get('/userlist', UsersManagerController.getUserList)

export default adminApiRouter
