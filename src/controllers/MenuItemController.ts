// src/controllers/menuController.ts

import { Request, Response } from "express";
import { MenuItemService } from "../services/MenuItemService";

const menuItemService = new MenuItemService();

export default {
  async getAll(req: Request, res: Response) {
    try {
      const items = await menuItemService.getAll();
      res.json(items);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const { name, category, price, imageUrl, description } = req.body;
      const item = await menuItemService.create({ name, category, price, imageUrl, description });
      res.status(201).json(item);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const item = await menuItemService.update(id, req.body);
      res.json(item);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      await menuItemService.remove(id);
      res.status(204).send();
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
};
