import { Request, Response } from "express";
import { purchaseService } from "../services/purchaseService";

export const purchaseController = {
  async create(req: Request, res: Response) {
    const result = await purchaseService.create(req.body.menuItemId);
    res.status(201).json(result);
  },

  async getAll(req: Request, res: Response) {
    const result = await purchaseService.getAll();
    res.json(result);
  }
};
