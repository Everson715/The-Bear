// src/routes/index.ts
import { Router } from "express";
import menuRoutes from "./menuRoutes";
import purchaseRoutes from "./purchaseRoutes";
import userRoutes from "./userRoutes";
import missionRoutes from "./missionRoutes"; // MUDANÇA: Importa o roteador de missão
import notificationRoutes from "./notificationRoutes";

const router = Router();

router.use("/auth", userRoutes);
router.use("/menu", menuRoutes);
router.use("/purchases", purchaseRoutes);
router.use("/missions", missionRoutes); // MUDANÇA: Adiciona as rotas de missão
router.use("/notifications", notificationRoutes);

export default router;