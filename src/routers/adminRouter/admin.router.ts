import express from "express";
import {Security} from "../../security/security";
import AdminController from "../../controllers/admincontroller/userManager.controller";
const adminApiRouter = express.Router()

adminApiRouter.use(Security.verifyToken, Security.checkAdmin);
adminApiRouter.get('/userlist', AdminController.getUserList);
adminApiRouter.get('/singers',AdminController.getSingers);
adminApiRouter.get('/composers',AdminController.getComposers);
adminApiRouter.get('/tags',AdminController.getTags);
adminApiRouter.post('/addsinger',AdminController.addSinger)
adminApiRouter.delete('/deletesinger/:id',AdminController.deleteSinger)
export default adminApiRouter
