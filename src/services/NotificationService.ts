// src/services/NotificationService.ts
import { prisma } from "../utils/prisma";

export const NotificationService = {
  async notifyUser(userId: string, message: string) {
    console.log(`Notifying user ${userId}: ${message}`);
    try {
      await prisma.notification.create({
        data: {
          userId,
          message,
          read: false,
        },
      });
    } catch (error) {
      console.error("Failed to create notification:", error);
    }
  },

  async getUserNotifications(userId: string) {
    return await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  },

  async markAsRead(notificationId: string) {
    return await prisma.notification.update({
      where: { id: notificationId },
      data: { read: true },
    });
  },
};

export default NotificationService;
