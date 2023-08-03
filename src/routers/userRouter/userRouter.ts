import express from "express";
import userController from "../../controllers/userController/user.controller";
const userRouter = express.Router();

userRouter.post('/upload/song',userController.addSong)
userRouter.get('/list/songs',userController.getSongs);
export default userRouter