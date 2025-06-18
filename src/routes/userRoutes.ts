// src/routes/userRoutes.ts
import { Router } from "express";
import { UserController } from "../controllers/UserController"; // Verifique se o caminho está correto

const router = Router();
const controller = new UserController();

// Rotas de Usuário/Autenticação (serão acessíveis via /auth)
router.post("/login", (req, res) => controller.login(req, res));
router.post("/register", (req, res) => controller.register(req, res));

export default router;