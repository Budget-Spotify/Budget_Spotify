import {Router} from "express";
import {AuthController} from "../../controllers/authController/auth.controller";

const authRouter = Router();

authRouter.post('/register', AuthController.register);
authRouter.post('/login', AuthController.login);

export default authRouter;