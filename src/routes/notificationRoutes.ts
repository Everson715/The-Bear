import { Router } from 'express';
import { getNotifications, markNotificationRead } from '../controllers/NotificationController';

const router = Router();

router.get('/:userId', getNotifications);
router.patch('/:id/read', markNotificationRead);

export default router;
