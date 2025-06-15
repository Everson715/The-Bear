"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationController = void 0;
const NotificationService_1 = __importDefault(require("../services/NotificationService"));
class NotificationController {
    async getByUser(req, res, next) {
        try {
            const userId = req.params.userId;
            const notifications = await NotificationService_1.default.getUserNotifications(userId);
            res.json(notifications);
        }
        catch (error) {
            next(error);
        }
    }
    async markAsRead(req, res, next) {
        try {
            const notificationId = req.params.id;
            const notification = await NotificationService_1.default.markAsRead(notificationId);
            res.json(notification);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.NotificationController = NotificationController;
