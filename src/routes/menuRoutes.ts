import express from "express";
import { menuController } from "../controllers/menuController";
import { isAdmin } from "../middlewares/isAdmin";

const router = express.Router();

// Público - visualizar menu
router.get("/", menuController.getAll);

// Privado - apenas admin
router.post("/", isAdmin, menuController.create);
router.put("/:id", isAdmin, menuController.update);
router.delete("/:id", isAdmin, menuController.remove);

export default router;
