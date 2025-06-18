// src/controllers/purchaseController.ts (Confirmado, já deve estar assim)

import { Request, Response } from "express";
import { purchaseService } from "../services/purchaseService";

export const purchaseController = {
  // Método para compra direta (se mantido, caso contrário, remova)
  async create(req: Request, res: Response) {
    try {
      const { userId, menuItemId } = req.body;
      if (!userId || !menuItemId) {
        return res.status(400).json({ error: "userId e menuItemId são obrigatórios." });
      }
      const purchase = await purchaseService.create(userId, menuItemId);
      res.status(201).json(purchase);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  // Método para obter todas as compras (já existentes)
  async getAll(req: Request, res: Response) {
    try {
      const purchases = await purchaseService.getAll();
      res.status(200).json(purchases);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  // --- MÉTODOS DE GERENCIAMENTO DE CARRINHO ---

  async getCartByUserId(req: Request, res: Response) {
    try {
      const userId = req.params.userId; // Ou req.user.id se usar autenticação JWT
      if (!userId) {
        return res.status(400).json({ error: "ID do usuário é obrigatório." });
      }
      const cart = await purchaseService.getCartByUserId(userId);
      res.status(200).json(cart);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async addToCart(req: Request, res: Response) {
    try {
      const { menuItemId, quantity } = req.body;
      // userId viria do token JWT, exemplo: req.user.id
      const userId = (req as any).user.id; // Supondo que você tem um middleware de autenticação que anexa 'user'
      if (!userId || !menuItemId || !quantity) {
        return res.status(400).json({ error: "userId, menuItemId e quantity são obrigatórios." });
      }
      await purchaseService.addToCart(userId, menuItemId, quantity);
      res.status(200).json({ message: "Item adicionado ao carrinho com sucesso!" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async updateCartItemQuantity(req: Request, res: Response) {
    try {
      const { cartItemId, newQuantity } = req.body;
      const userId = (req as any).user.id;
      if (!userId || !cartItemId || newQuantity === undefined) {
        return res.status(400).json({ error: "userId, cartItemId e newQuantity são obrigatórios." });
      }
      await purchaseService.updateCartItemQuantity(userId, cartItemId, newQuantity);
      res.status(200).json({ message: "Quantidade do item no carrinho atualizada com sucesso!" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async removeFromCart(req: Request, res: Response) {
    try {
      const { cartItemId } = req.body;
      const userId = (req as any).user.id;
      if (!userId || !cartItemId) {
        return res.status(400).json({ error: "userId e cartItemId são obrigatórios." });
      }
      await purchaseService.removeFromCart(userId, cartItemId);
      res.status(200).json({ message: "Item removido do carrinho com sucesso!" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async checkoutCart(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      if (!userId) {
        return res.status(400).json({ error: "ID do usuário é obrigatório." });
      }
      const purchase = await purchaseService.checkoutCart(userId);
      res.status(200).json({ message: "Compra finalizada com sucesso!", purchaseId: purchase.id });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },
};