import express from "express";
import { authenticate, checkRole } from "../middleware/auth.js";
import { banUserById, getAllUsers } from "../controllers/userController.js";

const router = express.Router();

router.get(
  "/",
  authenticate,
  checkRole({ roles: ["ADMIN", "SUPER_ADMIN"] }),
  getAllUsers
);
router.post(
  "/ban",
  authenticate,
  checkRole({ roles: ["ADMIN", "SUPER_ADMIN"] }),
  banUserById
);

export default router;
