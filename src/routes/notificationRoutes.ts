// src/routes/notificationRoutes.ts
import { Router } from 'express';
import { NotificationController } from '../controllers/NotificationController'; // Verifique o caminho

const router = Router();
const notificationController = new NotificationController();

// Ex: GET /api/notifications/:userId
router.get('/:userId', (req, res, next) => notificationController.getByUser(req, res, next));
// Ex: PATCH /api/notifications/:id/read
router.patch('/:id/read', (req, res, next) => notificationController.markAsRead(req, res, next));

export default router;