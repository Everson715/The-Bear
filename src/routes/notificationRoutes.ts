import { Router } from 'express';
import { NotificationController } from '../controllers/NotificationController';

const router = Router();
const notificationController = new NotificationController();

router.get('/:userId', (req, res, next) => notificationController.getByUser(req, res, next));
router.patch('/:id/read', (req, res, next) => notificationController.markAsRead(req, res, next));

export default router;
