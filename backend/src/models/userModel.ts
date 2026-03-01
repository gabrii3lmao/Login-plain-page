import mongoose, { Schema, model, Document } from "mongoose";
import bcrypt from "bcrypt";
import type { NextFunction } from "express";

interface IUser extends Document {
  name: string;
  email: string;
  password?: string | Promise<string>;
  resetPasswordToken?: string | undefined;
  resetPasswordExpires?: Date | undefined | number;
  isValidPassword(password: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function (next) {
  try {
    // vê se a senha foi modificada
    if (!this.isModified("password")) return;

    // gera um salt e faz um hash sobre a senha
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error: any) {
    next(error);
  }
});

userSchema.methods.isValidPassword = async function (password: string) {
  try {
    // compara a senha passada no parâmetro com a senha hasheada
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw new Error("Password comparison failed");
  }
};

const User = mongoose.model<IUser>("User", userSchema);
export default User;
