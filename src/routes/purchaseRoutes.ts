// src/routes/purchaseRoutes.ts
import { Router } from "express";
import { purchaseController } from "../controllers/purchaseController"; // Verifique o caminho

const router = Router();

// Ex: POST /api/purchases
router.post("/", purchaseController.create);
// Ex: GET /api/purchases
router.get("/", purchaseController.getAll);

export default router;