// src/routes/purchaseRoutes.ts
import { Router } from "express";
import { purchaseController } from "../controllers/purchaseController"; // Importe o objeto controller
import { authMiddleware } from "../middlewares/authMiddleware";
// import { adminMiddleware } from "../middlewares/adminMiddleware"; // Se não for usado aqui, pode remover

const router = Router();

// Rotas de Usuário Autenticado para Carrinho e Compras
router.get("/cart/:userId", authMiddleware, purchaseController.getCartByUserId); // GET /api/purchases/cart/:userId
router.post("/cart/add", authMiddleware, purchaseController.addToCart); // POST /api/purchases/cart/add
router.put("/cart/update/:cartItemId", authMiddleware, purchaseController.updateCartItemQuantity); // PUT /api/purchases/cart/update/:cartItemId
router.delete("/cart/remove/:cartItemId", authMiddleware, purchaseController.removeFromCart); // DELETE /api/purchases/cart/remove/:cartItemId
router.post("/cart/checkout", authMiddleware, purchaseController.checkoutCart); // POST /api/purchases/cart/checkout

router.get("/user/:userId", authMiddleware, purchaseController.getUserPurchases); // GET /api/purchases/user/:userId

// Rota para compra direta de item com grãos (se você precisar disso além do carrinho)
router.post("/buy-with-beans", authMiddleware, purchaseController.buyItemWithCoffeeBeans); // POST /api/purchases/buy-with-beans

// Rotas para admins (ex: ver todas as compras)
// router.get("/", authMiddleware, adminMiddleware, purchaseController.getAll); // GET /api/purchases (todas as compras)
// router.post("/", authMiddleware, adminMiddleware, purchaseController.create); // POST /api/purchases (criação direta de compra, se houver)


export default router;