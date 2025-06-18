// src/routes/missionRoutes.ts
import { Router } from "express";
import { MissionController } from "../controllers/missionController"; // Importe o controller
import { authMiddleware } from "../middlewares/authMiddleware";
import { isAdmin } from "../middlewares/isAdmin";

const router = Router();

// Rotas de ADMIN (CRUD para Missões)
router.post("/", authMiddleware, isAdmin, MissionController.createMission); // POST /api/missions
router.get("/", authMiddleware, isAdmin, MissionController.getAllMissions); // GET /api/missions (todas as missões para admin)
router.get("/:id", authMiddleware, isAdmin, MissionController.getMissionById); // GET /api/missions/:id
router.put("/:id", authMiddleware, isAdmin, MissionController.updateMission); // PUT /api/missions/:id
router.delete("/:id", authMiddleware, isAdmin, MissionController.deleteMission); // DELETE /api/missions/:id

export default router;