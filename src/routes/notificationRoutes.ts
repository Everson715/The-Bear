// src/routes/notificationRoutes.ts
import { Router } from 'express';
import { NotificationController } from '../controllers/NotificationController'; // Verifique se o caminho está correto

const router = Router();
const notificationController = new NotificationController();

// Rotas de Notificação (serão acessíveis via /api/notifications)
router.get('/:userId', (req, res, next) => notificationController.getByUser(req, res, next));
router.patch('/:id/read', (req, res, next) => notificationController.markAsRead(req, res, next));

export default router;