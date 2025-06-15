import { Request, Response } from "express";
import { purchaseService } from "../services/purchaseService";

export const purchaseController = {
  async create(req: Request, res: Response) {
    try {
      const { userId, menuItemId } = req.body;
      if (!userId || !menuItemId) {
        return res.status(400).json({ error: "userId e menuItemId são obrigatórios." });
      }

      const purchase = await purchaseService.create(userId, menuItemId);
      res.status(201).json(purchase);

    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },

  async getAll(_req: Request, res: Response) {
    try {
      const purchases = await purchaseService.getAll();
      res.json(purchases);
    } catch (err: any) {
      res.status(500).json({ error: "Erro ao buscar compras." });
    }
  }
};
