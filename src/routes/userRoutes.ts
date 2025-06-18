// src/routes/userRoutes.ts
import { Router } from "express";
import { UserController } from "../controllers/UserController"; // Importe o objeto
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/profile", authMiddleware, UserController.getUserProfile);

export default router;