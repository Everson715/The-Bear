// src/controllers/menuController.ts
import { Request, Response } from 'express';
import { MenuItemService } from '../services/MenuItemService';

const menuItemService = new MenuItemService();

export const menuController = {
  async getAllMenuItems(req: Request, res: Response) {
    try {
      const items = await menuItemService.getAll();
      res.json(items);
    } catch (error: any) {
      console.error("Error fetching menu items:", error);
      res.status(500).json({ error: error.message || "Failed to fetch menu items." });
    }
  },

  async getMenuItemById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const item = await menuItemService.getById(parseInt(id));
      if (!item) {
        return res.status(404).json({ error: "Menu item not found." });
      }
      res.json(item);
    } catch (error: any) {
      console.error("Error fetching menu item by ID:", error);
      res.status(500).json({ error: error.message || "Failed to fetch menu item." });
    }
  },

  async createMenuItem(req: Request, res: Response) {
    try {
      const { name, description, price, imageUrl, category, xpGain, coffeeBeansGain } = req.body;
      const newItem = await menuItemService.create({ name, description, price, imageUrl, category, xpGain, coffeeBeansGain });
      res.status(201).json(newItem);
    } catch (error: any) {
      console.error("Error creating menu item:", error);
      res.status(400).json({ error: error.message || "Failed to create menu item." });
    }
  },

  async updateMenuItem(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, description, price, imageUrl, category, xpGain, coffeeBeansGain } = req.body;
      const updatedItem = await menuItemService.update(parseInt(id), { name, description, price, imageUrl, category, xpGain, coffeeBeansGain });
      res.json(updatedItem);
    } catch (error: any) {
      console.error("Error updating menu item:", error);
      res.status(400).json({ error: error.message || "Failed to update menu item." });
    }
  },

  async deleteMenuItem(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await menuItemService.remove(parseInt(id));
      res.status(204).send();
    } catch (error: any) {
      console.error("Error deleting menu item:", error);
      res.status(500).json({ error: error.message || "Failed to delete menu item." });
    }
  },

  async getCategories(req: Request, res: Response) {
    try {
      const categories = await menuItemService.getCategories();
      res.json(categories);
    } catch (error: any) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ error: error.message || "Failed to fetch categories." });
    }
  }
};