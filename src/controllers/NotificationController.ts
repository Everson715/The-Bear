import { Request, Response, NextFunction } from 'express';
import NotificationService from '../services/NotificationService';

export class NotificationController {
  async getByUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId;
      const notifications = await NotificationService.getUserNotifications(userId);
      res.json(notifications);
    } catch (error) {
      next(error);
    }
  }

  async markAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const notificationId = req.params.id;
      const notification = await NotificationService.markAsRead(notificationId);
      res.json(notification);
    } catch (error) {
      next(error);
    }
  }
}
