import express from "express";
import UsersManagerController from "../../controllers/admincontroller/userManager.controller";
import { Security } from "../../security/security";
const adminApiRouter = express.Router()
adminApiRouter.use(Security.checkAdmin)
adminApiRouter.get('/userlist', UsersManagerController.getUserList)
export default adminApiRouter
