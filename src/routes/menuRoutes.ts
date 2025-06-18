// src/routes/menuRoutes.ts
import { Router } from "express";
import { menuController } from "../controllers/menuController"; // Importe o objeto controller
import { authMiddleware } from "../middlewares/authMiddleware"; // Assumindo que você ainda usa este para autenticação
import { isAdmin } from "../middlewares/isAdmin"; // CORRIGIDO: Importa a função nomeada 'isAdmin'

const router = Router();

// Rotas de Usuário Autenticado
// Note que 'authMiddleware' deve vir antes de qualquer rota que use 'req.user'
router.get("/", authMiddleware, menuController.getAllMenuItems); // GET /api/menu
router.get("/categories", authMiddleware, menuController.getCategories); // GET /api/menu/categories
router.get("/:id", authMiddleware, menuController.getMenuItemById); // GET /api/menu/:id

// Rotas de ADMIN (exigem authMiddleware E isAdmin)
// É crucial que authMiddleware venha ANTES de isAdmin, se isAdmin depender de req.user
// No seu caso de isAdmin.ts, ele está pegando "user-id" do header, então a ordem pode não ser tão estrita
// Mas para manter a consistência e caso authMiddleware adicione outras coisas a req.user, mantenha authMiddleware primeiro.
router.post("/", authMiddleware, isAdmin, menuController.createMenuItem); // POST /api/menu
router.put("/:id", authMiddleware, isAdmin, menuController.updateMenuItem); // PUT /api/menu/:id
router.delete("/:id", authMiddleware, isAdmin, menuController.deleteMenuItem); // DELETE /api/menu/:id

export default router;