// src/controllers/PurchaseController.ts
import { Request, Response } from "express";
import { purchaseService } from "../services/purchaseService"; // Importe o objeto purchaseService

// Certifique-se de que a interface Request do Express está estendida
// com a propriedade 'user' populada pelo seu authMiddleware.
// Isso deve estar em src/types/express.d.ts (verificado no Passo 1)

// Exporta um objeto com os métodos, em vez de uma classe
export const purchaseController = {
  async create(req: Request, res: Response) { // Se você usa uma rota de compra direta
    try {
      const userId = req.user?.userId; // Pega o ID do usuário do token
      const { menuItemId } = req.body;
      if (!userId || !menuItemId) {
        return res.status(400).json({ error: "userId e menuItemId são obrigatórios." });
      }
      const purchase = await purchaseService.create(userId, menuItemId);
      res.status(201).json(purchase);
    } catch (error: any) {
      console.error("Erro ao criar compra:", error);
      res.status(500).json({ error: error.message || "Erro interno do servidor." });
    }
  },

  async getAll(req: Request, res: Response) { // Se você tem uma rota para admins verem todas as compras
    try {
      const purchases = await purchaseService.getAll();
      res.status(200).json(purchases);
    } catch (error: any) {
      console.error("Erro ao obter todas as compras:", error);
      res.status(500).json({ error: error.message || "Erro interno do servidor." });
    }
  },

  async getCartByUserId(req: Request, res: Response) {
    try {
      // O userId pode vir dos parâmetros da rota ou do token, dependendo do design.
      // Se a rota for /cart, use req.user.userId
      const userId = req.user?.userId || req.params.userId; // Prefira o ID do token
      if (!userId) {
        return res.status(400).json({ error: "ID do usuário é obrigatório." });
      }
      const cart = await purchaseService.getCartByUserId(userId);
      res.status(200).json(cart);
    } catch (error: any) {
      console.error("Erro ao obter carrinho:", error);
      res.status(500).json({ error: error.message || "Erro interno do servidor ao obter carrinho." });
    }
  },

  async addToCart(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const { menuItemId, quantity } = req.body;
      if (!userId || !menuItemId || !quantity) {
        return res.status(400).json({ error: "userId, menuItemId e quantity são obrigatórios." });
      }
      await purchaseService.addToCart(userId, menuItemId, quantity);
      res.status(200).json({ message: "Item adicionado ao carrinho com sucesso." });
    } catch (error: any) {
      console.error("Erro ao adicionar ao carrinho:", error);
      res.status(500).json({ error: error.message || "Erro interno do servidor ao adicionar ao carrinho." });
    }
  },

  async updateCartItemQuantity(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const { cartItemId } = req.params;
      const { newQuantity } = req.body;
      if (!userId || !cartItemId || typeof newQuantity !== 'number') {
        return res.status(400).json({ error: "userId, cartItemId e newQuantity são obrigatórios." });
      }
      await purchaseService.updateCartItemQuantity(userId, cartItemId, newQuantity);
      res.status(200).json({ message: "Quantidade do item no carrinho atualizada." });
    } catch (error: any) {
      console.error("Erro ao atualizar item do carrinho:", error);
      res.status(500).json({ error: error.message || "Erro interno do servidor ao atualizar carrinho." });
    }
  },

  async removeFromCart(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const { cartItemId } = req.params;
      if (!userId || !cartItemId) {
        return res.status(400).json({ error: "userId e cartItemId são obrigatórios." });
      }
      await purchaseService.removeFromCart(userId, cartItemId);
      res.status(200).json({ message: "Item removido do carrinho." });
    } catch (error: any) {
      console.error("Erro ao remover do carrinho:", error);
      res.status(500).json({ error: error.message || "Erro interno do servidor ao remover do carrinho." });
    }
  },

  async checkoutCart(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const { paymentMethod } = req.body;
      if (!userId || !paymentMethod) {
        return res.status(400).json({ error: "userId e paymentMethod são obrigatórios." });
      }
      if (paymentMethod !== 'cash' && paymentMethod !== 'coffeeBeans') {
          return res.status(400).json({ error: "Método de pagamento inválido. Use 'cash' ou 'coffeeBeans'." });
      }

      const newPurchase = await purchaseService.checkoutCart(userId, paymentMethod);
      res.status(200).json(newPurchase);
    } catch (error: any) {
      console.error("Erro ao finalizar compra:", error);
      res.status(500).json({ error: error.message || "Erro interno do servidor ao finalizar compra." });
    }
  },

  async getUserPurchases(req: Request, res: Response) {
    try {
      const userId = req.user?.userId || req.params.userId; // Pega o userId do token ou params
      if (!userId) {
        return res.status(401).json({ message: "Usuário não autenticado." });
      }
      const purchases = await purchaseService.getUserPurchases(userId);
      res.status(200).json(purchases);
    } catch (error: any) {
      console.error("Erro ao obter pedidos do usuário:", error);
      res.status(500).json({ error: error.message || "Erro interno do servidor." });
    }
  },

  async buyItemWithCoffeeBeans(req: Request, res: Response) { // Se você precisar disso
    try {
      const userId = req.user?.userId;
      const { menuItemId } = req.body;
      if (!userId || !menuItemId) {
        return res.status(400).json({ error: "userId e menuItemId são obrigatórios." });
      }
      const purchase = await purchaseService.buyItemWithCoffeeBeans(userId, menuItemId);
      res.status(200).json(purchase);
    } catch (error: any) {
      console.error("Erro ao comprar item com grãos:", error);
      res.status(500).json({ error: error.message || "Erro interno do servidor." });
    }
  }
};