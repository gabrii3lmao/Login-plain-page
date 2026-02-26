import express from "express";
import { UserController } from "../controllers/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import User from "../models/userModel.js";

const authRouter = express.Router();

authRouter.post("/signup", UserController.register);
authRouter.post("/signin", UserController.login);
authRouter.get("/users", authMiddleware, UserController.getUsers);

authRouter.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({ error: "Email not found!" });
    }

    const token = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    // NodeMailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "gabrielmluz56@gmail.com",
        pass: "wans yarc qrxj nvqu",
      },
    });

    const mailOptions = {
      from: "no-replay@teste.com",
      to: user.email,
      subject: "Recuperação de Senha",
      text: `Você solicitou a alteração de senha. Use o link para alterar a sua senha: \n\n http://localhost:5173/reset-password/${token}`,
    };  

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email de recuperação enviado!" });
  } catch (error) {
    console.error("An error has occurried on forgot-password: ", error);
  }
});

authRouter.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      res.status(400).json({ error: "Token inválido ou expirado." });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: "Senha atualizada com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: "Error while reseting password." });
  }
});

export default authRouter;
