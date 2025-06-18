// src/routes/purchaseRoutes.ts (Confirmado, já deve estar assim)

import { Router } from "express";
import { purchaseController } from "../controllers/purchaseController";
import { authMiddleware } from "../middlewares/authMiddleware"; // Certifique-se de que o caminho está correto

const router = Router();

// Rota para compra direta (se mantida, caso contrário, remova)
router.post("/purchase", authMiddleware, purchaseController.create);

// Rota para obter todas as compras (finalizadas)
router.get("/purchases", authMiddleware, purchaseController.getAll);

// Rotas do carrinho
router.get("/cart/:userId", authMiddleware, purchaseController.getCartByUserId); // Pode ser "/cart" e usar req.user.id
router.post("/cart/add", authMiddleware, purchaseController.addToCart);
router.put("/cart/update", authMiddleware, purchaseController.updateCartItemQuantity);
router.delete("/cart/remove", authMiddleware, purchaseController.removeFromCart);
router.post("/cart/checkout", authMiddleware, purchaseController.checkoutCart);

export default router;