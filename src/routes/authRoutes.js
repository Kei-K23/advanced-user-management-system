import express from "express";
import {
  getMe,
  login,
  logout,
  register,
  updateMe,
  deleteMe,
} from "../controllers/authController.js";
import authenticate from "../middleware/auth.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/logout", authenticate, logout);
router.get("/me", authenticate, getMe);
router.patch("/me", authenticate, updateMe);
router.delete("/me", authenticate, deleteMe);

export default router;
