"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.missionController = void 0;
const missionService_1 = require("../services/missionService");
exports.missionController = {
    async create(req, res) {
        try {
            const mission = await missionService_1.missionService.create(req.body);
            res.status(201).json(mission);
        }
        catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    async getAll(req, res) {
        try {
            const missions = await missionService_1.missionService.getAll();
            res.json(missions);
        }
        catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    async getUserMissions(req, res) {
        try {
            const userId = req.params.userId;
            if (!userId)
                return res.status(400).json({ error: "userId inválido" });
            const missions = await missionService_1.missionService.checkAndGetMissions(userId);
            res.json(missions);
        }
        catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    async complete(req, res) {
        try {
            const userId = req.params.userId;
            const missionId = Number(req.params.id);
            if (!userId || isNaN(missionId)) {
                return res.status(400).json({ error: "Parâmetros inválidos" });
            }
            const result = await missionService_1.missionService.complete(userId, missionId);
            res.json(result);
        }
        catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
};
