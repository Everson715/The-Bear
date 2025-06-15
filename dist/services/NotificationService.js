"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../utils/prisma");
exports.default = {
    async notifyUser(userId, message) {
        return await prisma_1.prisma.notification.create({
            data: { userId, message }
        });
    },
    async getUserNotifications(userId) {
        return await prisma_1.prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });
    },
    async markAsRead(notificationId) {
        return await prisma_1.prisma.notification.update({
            where: { id: notificationId },
            data: { read: true }
        });
    }
};
