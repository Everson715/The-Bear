import { Request, Response } from "express";
import { MenuItemService } from "../services/MenuItemService";

const service = new MenuItemService();

export const menuController = {
  async getAll(req: Request, res: Response) {
    const items = await service.getAll();
    res.json(items);
  },

  async create(req: Request, res: Response) {
    try {
      const { name, category, price, imageUrl, description } = req.body;
      const newItem = await service.create({ name, category, price, imageUrl, description });
      res.status(201).json(newItem);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, category, price, imageUrl, description } = req.body;
      const updated = await service.update(+id, { name, category, price, imageUrl, description });
      res.json(updated);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  },

  async remove(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await service.remove(+id);
      res.status(204).end();
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  }
};
