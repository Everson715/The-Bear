import { Router } from "express";
import userRoutes from "./userRoutes";
import menuRoutes from "./menuRoutes";
import purchaseRoutes from "./purchaseRoutes";
import notificationRoutes from "./notificationRoutes";
import missionRoutes from "./missionRoutes";

const routes = Router();

// Agrupamento das rotas
routes.use("/api/users", userRoutes);               // Login, registro, perfil
routes.use("/api/menu", menuRoutes);                // Itens do cardápio
routes.use("/api/purchases", purchaseRoutes);       // Compras e XP
routes.use("/api/notifications", notificationRoutes); // Notificações
routes.use("/api/missions", missionRoutes);         // Missões

export default routes;
