import { Router } from "express";
import { menuController } from "../controllers/menuController";
import { purchaseController } from "../controllers/purchaseController";
import { missionController } from "../controllers/missionController";

const router = Router();

// Menu
router.get("/menu", menuController.getAll);
router.post("/menu", menuController.create);

// Purchase
router.post("/purchase", purchaseController.create);
router.get("/purchase", purchaseController.getAll);

// Mission
router.post("/missions", missionController.create);
router.get("/missions", missionController.getAll);
router.put("/missions/:id/complete", missionController.complete);

export default router;
