// src/routes/menuRoutes.ts
import express from "express";
import { menuController } from "../controllers/menuController"; // Verifique se o caminho para menuController.ts está correto
import { isAdmin } from "../middlewares/isAdmin"; // Verifique se o caminho para isAdmin.ts está correto

const router = express.Router();

// Rotas de Menu (serão acessíveis via /api/menu)
// Público - visualizar menu
router.get("/", menuController.getAll);

// Privado - apenas admin
router.post("/", isAdmin, menuController.create);
router.put("/:id", isAdmin, menuController.update);
router.delete("/:id", isAdmin, menuController.remove);

export default router;