import User from "../models/userModel.js";
import generateToken from "../services/jwtService.js";

export class UserController {
  static async register(req, res, next) {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const existUser = await User.findOne({ email });
      if (existUser) {
        return res.status(409).json({ error: "Email is already registed" });
      }

      const user = await User.create({ name, email, password });
      return res.status(201).json({ message: "User registered successfuly!" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      const isMatch = await user.isValidPassword(password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      const token = generateToken({ id: user.id, email: user.email });
      res.json({ message: "Login successful!", token });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async profile(req, res) {
    res.json({
      message: "Welcome to your profile",
      user: req.user,
    });
  }

  static async getUsers(req, res) {
    try {
      const users = await User.find({});
      res.status(200).json(users);
    } catch (err) {
      res.json({ error: err });
    }
  }
}
