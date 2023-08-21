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
adminApiRouter.post('/addcomposer',AdminController.addComposer)
adminApiRouter.delete('/deletecomposer/:id',AdminController.deleteComposer)
adminApiRouter.post('/addtag',AdminController.addTag)
adminApiRouter.delete('/deletetag/:id',AdminController.deleteTag)
export default adminApiRouter
