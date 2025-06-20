// src/controllers/PurchaseController.ts
import { Request, Response } from 'express';
import { purchaseService } from '../services/purchaseService';

export const purchaseController = {
  async getCartByUserId(req: Request, res: Response) {
    try {
      const userIdFromParam = req.params.userId; // Get userId from URL parameter
      const authenticatedUserId = req.user?.userId; // Get userId from authenticated user (from token)

      // IMPORTANT SECURITY CHECK: Ensure the user is only fetching their *own* cart,
      // unless this route is specifically for admins.
      if (userIdFromParam !== authenticatedUserId && !req.user?.isAdmin) {
          return res.status(403).json({ message: "Acesso negado. Você só pode ver seu próprio carrinho." });
      }

      const cart = await purchaseService.getCartByUserId(userIdFromParam);
      res.status(200).json(cart);
    } catch (error: any) {
      console.error("Erro ao buscar carrinho do usuário:", error);
      res.status(500).json({ message: error.message || "Erro interno do servidor." });
    }
  },

  async addToCart(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Usuário não autenticado." });
      }
      const { menuItemId, quantity } = req.body;
      if (!menuItemId || !quantity || quantity < 1) {
        return res.status(400).json({ error: "menuItemId e quantity são obrigatórios e quantity deve ser maior que 0." });
      }
      await purchaseService.addToCart(userId, menuItemId, quantity);
      res.status(200).json({ message: "Item adicionado ao carrinho com sucesso." });
    } catch (error: any) {
      console.error("Error adding to cart:", error);
      res.status(400).json({ error: error.message || "Failed to add item to cart." });
    }
  },

  async updateCartItemQuantity(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Usuário não autenticado." });
      }
      const { cartItemId } = req.params;
      const { newQuantity } = req.body;
      if (typeof newQuantity !== 'number' || newQuantity < 0) {
        return res.status(400).json({ error: "newQuantity é obrigatório e deve ser um número não negativo." });
      }
      // Usar cartItemId como string direto, sem parseInt
      await purchaseService.updateCartItemQuantity(userId, cartItemId, newQuantity);
      res.status(200).json({ message: "Quantidade do item no carrinho atualizada com sucesso." });
    } catch (error: any) {
      console.error("Error updating cart item quantity:", error);
      res.status(400).json({ error: error.message || "Failed to update cart item quantity." });
    }
  },

  async removeFromCart(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Usuário não autenticado." });
      }
      const { cartItemId } = req.params;
      // Usar cartItemId como string direto, sem parseInt
      await purchaseService.removeFromCart(userId, cartItemId);
      res.status(200).json({ message: "Item removido do carrinho com sucesso." });
    } catch (error: any) {
      console.error("Error removing from cart:", error);
      res.status(400).json({ error: error.message || "Failed to remove item from cart." });
    }
  },

  async checkoutCart(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Usuário não autenticado." });
      }
      const { paymentMethod } = req.body;
      if (paymentMethod !== 'cash' && paymentMethod !== 'coffeeBeans') {
        return res.status(400).json({ error: "Método de pagamento inválido. Use 'cash' ou 'coffeeBeans'." });
      }
      const purchase = await purchaseService.checkoutCart(userId, paymentMethod);
      res.status(200).json(purchase);
    } catch (error: any) {
      console.error("Error checking out cart:", error);
      res.status(400).json({ error: error.message || "Failed to checkout cart." });
    }
  },

  async getUserPurchases(req: Request, res: Response) {
    try {
      const userIdFromParam = req.params.userId; // Get userId from URL parameter
      const authenticatedUserId = req.user?.userId; // Get userId from authenticated user (from token)

      // IMPORTANT SECURITY CHECK: Ensure the user is only fetching their *own* purchases,
      // unless this route is specifically for admins.
      if (userIdFromParam !== authenticatedUserId && !req.user?.isAdmin) {
          return res.status(403).json({ message: "Acesso negado. Você só pode ver seus próprios pedidos." });
      }

      const purchases = await purchaseService.getUserPurchases(userIdFromParam);
      res.status(200).json(purchases);
    } catch (error: any) {
      console.error("Erro ao buscar pedidos do usuário:", error);
      res.status(500).json({ message: error.message || "Erro interno do servidor." });
    }
  },

  async buyItemWithCoffeeBeans(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Usuário não autenticado." });
      }
      const { menuItemId } = req.body;
      if (!menuItemId) {
        return res.status(400).json({ error: "menuItemId é obrigatório." });
      }
      const purchase = await purchaseService.buyItemWithCoffeeBeans(userId, menuItemId);
      res.status(200).json(purchase);
    } catch (error: any) {
      console.error("Error buying item with coffee beans:", error);
      res.status(400).json({ error: error.message || "Failed to buy item with coffee beans." });
    }
  }
};
