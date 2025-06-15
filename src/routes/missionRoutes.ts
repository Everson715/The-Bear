import { Router } from "express";
import { missionController } from "../controllers/missionController";

const router = Router();

// Criar missão
router.post("/missions", missionController.create);

// Listar todas as missões
router.get("/missions", missionController.getAll);

// Listar missões de um usuário
router.get("/users/:userId/missions", missionController.getUserMissions);

// Completar missão de um usuário
router.put("/users/:userId/missions/:id/complete", missionController.complete);

export default router;
