"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const NotificationController_1 = require("../controllers/NotificationController");
const router = (0, express_1.Router)();
const notificationController = new NotificationController_1.NotificationController();
router.get('/:userId', (req, res, next) => notificationController.getByUser(req, res, next));
router.patch('/:id/read', (req, res, next) => notificationController.markAsRead(req, res, next));
exports.default = router;
