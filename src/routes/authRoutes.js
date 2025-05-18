import express from "express";
import {
  getMe,
  login,
  logout,
  register,
  updateMe,
  deleteMe,
  getSessionsForAuthUser,
} from "../controllers/authController.js";
import authenticate from "../middleware/auth.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/logout", authenticate, logout);
router.get("/me", authenticate, getMe);
router.patch("/me", authenticate, updateMe);
router.delete("/me", authenticate, deleteMe);
router.get("/me/sessions", authenticate, getSessionsForAuthUser);

export default router;
