// src/routes/index.ts (Este arquivo AGREGA as rotas para o prefixo /api)

import { Router } from "express";

// Importa os roteadores individuais que farão parte do grupo /api
import menuRoutes from "./menuRoutes";             // Caminho relativo ao index.ts
import notificationRoutes from "./notificationRoutes"; // Caminho relativo ao index.ts
import missionRoutes from "./missionRoutes";         // Caminho relativo ao index.ts
import purchaseRoutes from "./purchaseRoutes";       // Caminho relativo ao index.ts

// IMPORTANTE: NÃO importe userRoutes aqui, pois ele é montado separadamente em server.ts sob /auth

const mainRouter = Router();

// Monta as rotas dentro deste roteador. Se este roteador for montado como /api,
// então /menu se torna /api/menu, /notifications se torna /api/notifications, etc.
mainRouter.use("/menu", menuRoutes);
mainRouter.use("/notifications", notificationRoutes);
mainRouter.use("/missions", missionRoutes);     // Ex: POST /api/missions, GET /api/users/:userId/missions
mainRouter.use("/purchases", purchaseRoutes);

// Rota de teste para a raiz deste agrupador (ex: GET /api/)
mainRouter.get("/", (req, res) => {
  res.send("Sub-API Routes (montadas em /api) funcionando!");
});

export default mainRouter; // Exporta este roteador para ser usado em server.ts