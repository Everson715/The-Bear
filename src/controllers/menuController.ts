import { Request, Response } from "express";
import { menuService } from "../services/menuService";

export const menuController = {
  async getAll(req: Request, res: Response) {
    const items = await menuService.getAll();
    res.json(items);
  },

  async create(req: Request, res: Response) {
    const item = await menuService.create(req.body);
    res.status(201).json(item);
  }
};
