// src/routes/purchaseRoutes.ts
import { Router } from "express";
import { purchaseController } from "../controllers/purchaseController";

const router = Router();

router.post("/", purchaseController.create);
router.get("/", purchaseController.getAll);

export default router;
