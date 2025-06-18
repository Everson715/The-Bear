// src/routes/menuRoutes.ts
import express from "express";
import { menuController } from "../controllers/menuController"; // Verifique o caminho
import { isAdmin } from "../middlewares/isAdmin"; // Verifique o caminho

const router = express.Router();

// Público - visualizar menu (Ex: GET /api/menu/)
router.get("/", menuController.getAll);

// Privado - apenas admin (Ex: POST /api/menu/, PUT /api/menu/:id, DELETE /api/menu/:id)
router.post("/", isAdmin, menuController.create);
router.put("/:id", isAdmin, menuController.update);
router.delete("/:id", isAdmin, menuController.remove);

export default router;