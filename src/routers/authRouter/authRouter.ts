import {Router} from "express";
import {AuthController} from "../../controllers/authController/authController";

const authRouter = Router();

authRouter.post('/register', AuthController.register);
authRouter.post('/login', AuthController.login);

export default authRouter;