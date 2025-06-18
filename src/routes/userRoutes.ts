// src/routes/userRoutes.ts
import { Router } from "express";
import { UserController } from "../controllers/UserController"; // Verifique o caminho

const router = Router();
const controller = new UserController();

// Ex: POST /auth/login
router.post("/login", (req, res) => controller.login(req, res));
// Ex: POST /auth/register
router.post("/register", (req, res) => controller.register(req, res));

export default router;