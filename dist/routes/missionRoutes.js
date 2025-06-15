"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const missionController_1 = require("../controllers/missionController");
const router = (0, express_1.Router)();
// Criar missão
router.post("/missions", missionController_1.missionController.create);
// Listar todas as missões
router.get("/missions", missionController_1.missionController.getAll);
// Listar missões de um usuário
router.get("/users/:userId/missions", missionController_1.missionController.getUserMissions);
// Completar missão de um usuário
router.put("/users/:userId/missions/:id/complete", missionController_1.missionController.complete);
exports.default = router;
