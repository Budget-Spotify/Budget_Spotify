import express from "express";
import UsersManagerController from "../controllers/admincontroller/userManager.controller";
const adminApiRouter = express.Router()

adminApiRouter.get('/users',UsersManagerController.getUserList)

export default adminApiRouter
