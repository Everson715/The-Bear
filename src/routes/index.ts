// src/routes/index.ts
import { Router } from "express";
import menuRoutes from "./menuRoutes";
import purchaseRoutes from "./purchaseRoutes";
import userRoutes from "./userRoutes"; // Importa o roteador de usuário
import missionRoutes from "./missionRoutes";
import notificationRoutes from "./notificationRoutes";

const router = Router();

router.use("/auth", userRoutes); // Todas as rotas de userRoutes serão prefixadas com /auth
router.use("/menu", menuRoutes);
router.use("/purchases", purchaseRoutes);
router.use("/missions", missionRoutes);
router.use("/notifications", notificationRoutes);

export default router;