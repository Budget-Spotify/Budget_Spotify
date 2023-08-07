import express from "express";
import userController from "../../controllers/userController/user.controller";
import {Security} from "../../security/security";

const userRouter = express.Router();

userRouter.post('/upload/song', userController.addSong)
userRouter.get('/list/songs', userController.getSongs);
userRouter.get('/song/detail/:id', userController.getOneSong);
userRouter.post('/upload/song',userController.addSong)
userRouter.get('/list/songs',userController.getSongs);
userRouter.get('/info',userController.getDetail)
userRouter.put('/editpassword',userController.editPassword)
userRouter.put('/editinfo',userController.editInfo)
export default userRouter