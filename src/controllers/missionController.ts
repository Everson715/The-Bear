import { Request, Response } from "express";
import { missionService } from "../services/missionService";

export const missionController = {
  async create(req: Request, res: Response) {
    try {
      const mission = await missionService.create(req.body);
      res.status(201).json(mission);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },

  async getAll(req: Request, res: Response) {
    try {
      const missions = await missionService.getAll();
      res.json(missions);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },

  async getUserMissions(req: Request, res: Response) {
    try {
      const userId = req.params.userId;
      if (!userId) return res.status(400).json({ error: "userId inválido" });

      const missions = await missionService.checkAndGetMissions(userId);
      res.json(missions);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },

  async complete(req: Request, res: Response) {
    try {
      const userId = req.params.userId;
      const missionId = Number(req.params.id);

      if (!userId || isNaN(missionId)) {
        return res.status(400).json({ error: "Parâmetros inválidos" });
      }

      const result = await missionService.complete(userId, missionId);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
};
