import { Request, Response } from "express";
import { missionService } from "../services/missionService";

export const missionController = {
  async create(req: Request, res: Response) {
    const mission = await missionService.create(req.body);
    res.status(201).json(mission);
  },

  async getAll(req: Request, res: Response) {
    const missions = await missionService.getAll();
    res.json(missions);
  },

  async complete(req: Request, res: Response) {
    const { id } = req.params;
    const result = await missionService.complete(Number(id));
    res.json(result);
  }
};
