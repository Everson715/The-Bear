// src/routes/missionRoutes.ts
import { Router } from "express";
import { missionController } from "../controllers/missionController"; // Verifique o caminho

const router = Router();

// Criar missão (Ex: POST /api/missions)
router.post("/missions", missionController.create);

// Listar todas as missões (Ex: GET /api/missions)
router.get("/missions", missionController.getAll);

// Listar missões de um usuário (Ex: GET /api/users/:userId/missions)
router.get("/users/:userId/missions", missionController.getUserMissions);

// Completar missão de um usuário (Ex: PUT /api/users/:userId/missions/:id/complete)
router.put("/users/:userId/missions/:id/complete", missionController.complete);

export default router;