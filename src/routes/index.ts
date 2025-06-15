import { Router } from "express";
import { menuController } from "../controllers/menuController";
import { purchaseController } from "../controllers/purchaseController";
import { missionController } from "../controllers/missionController";

const router = Router();

// Menu
router.get("/menu", menuController.getAll);
router.post("/menu", menuController.create);

export default router;
