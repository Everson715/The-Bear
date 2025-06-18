// src/controllers/menuController.ts
import { Request, Response } from 'express';
// Supondo que você tenha um MenuService ou diretamente use o Prisma
import { prisma } from '../utils/prisma'; // Ou importe seu MenuService

export const menuController = { // <-- EXPORTE UM OBJETO COM OS MÉTODOS
  async getAllMenuItems(req: Request, res: Response) {
    try {
      const items = await prisma.menuItem.findMany();
      res.json(items);
    } catch (error: any) {
      console.error("Error fetching menu items:", error);
      res.status(500).json({ error: error.message || "Failed to fetch menu items." });
    }
  },

  async getMenuItemById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const item = await prisma.menuItem.findUnique({ where: { id: parseInt(id) } });
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
      const newItem = await prisma.menuItem.create({
        data: { name, description, price, imageUrl, category, xpGain, coffeeBeansGain },
      });
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
      const updatedItem = await prisma.menuItem.update({
        where: { id: parseInt(id) },
        data: { name, description, price, imageUrl, category, xpGain, coffeeBeansGain },
      });
      res.json(updatedItem);
    } catch (error: any) {
      console.error("Error updating menu item:", error);
      res.status(400).json({ error: error.message || "Failed to update menu item." });
    }
  },

  async deleteMenuItem(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await prisma.menuItem.delete({ where: { id: parseInt(id) } });
      res.status(204).send(); // No Content
    } catch (error: any) {
      console.error("Error deleting menu item:", error);
      res.status(500).json({ error: error.message || "Failed to delete menu item." });
    }
  },

  async getCategories(req: Request, res: Response) {
    try {
      const categories = await prisma.menuItem.findMany({
        distinct: ['category'],
        select: { category: true }
      });
      res.json(categories.map(c => c.category).filter(Boolean)); // Filtra null/undefined
    } catch (error: any) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ error: error.message || "Failed to fetch categories." });
    }
  }
};