// src/routes/missionRoutes.ts
import { Router } from "express";
import { missionController } from "../controllers/missionController"; // Verifique se o caminho está correto

const router = Router();

// Rotas de Missão (serão acessíveis via /api/)
// Ex: POST /api/missions, GET /api/missions, GET /api/users/:userId/missions
router.post("/missions", missionController.create);
router.get("/missions", missionController.getAll);
router.get("/users/:userId/missions", missionController.getUserMissions);
router.put("/users/:userId/missions/:id/complete", missionController.complete);

export default router;