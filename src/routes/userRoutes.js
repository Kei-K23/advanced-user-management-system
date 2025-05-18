import express from "express";
import { authenticate, checkRole } from "../middleware/auth.js";
import { getAllUsers } from "../controllers/userController.js";

const router = express.Router();

router.get(
  "/",
  authenticate,
  checkRole({ roles: ["ADMIN", "SUPER_ADMIN"] }),
  getAllUsers
);

export default router;
