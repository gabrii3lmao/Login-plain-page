import express from "express";
import { UserController } from "../controllers/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const authRouter = express.Router();

authRouter.post("/signup", UserController.register);
authRouter.post("/signin", UserController.login);
authRouter.get("/profile", authMiddleware, UserController.profile);
authRouter.get("/users", UserController.getUsers);
export default authRouter;
