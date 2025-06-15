import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default {
  async notifyUser(userId: string, message: string) {
    return await prisma.notification.create({
      data: { userId, message }
    });
  },

  async getUserNotifications(userId: string) {
    return await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  },

  async markAsRead(notificationId: string) {
    return await prisma.notification.update({
      where: { id: notificationId },
      data: { read: true }
    });
  }
};
