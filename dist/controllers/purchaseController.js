"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.purchaseController = void 0;
const purchaseService_1 = require("../services/purchaseService");
exports.purchaseController = {
    async create(req, res) {
        try {
            const { userId, menuItemId } = req.body;
            if (!userId || !menuItemId) {
                return res.status(400).json({ error: "userId e menuItemId são obrigatórios." });
            }
            const purchase = await purchaseService_1.purchaseService.create(userId, menuItemId);
            res.status(201).json(purchase);
        }
        catch (err) {
            res.status(400).json({ error: err.message });
        }
    },
    async getAll(_req, res) {
        try {
            const purchases = await purchaseService_1.purchaseService.getAll();
            res.json(purchases);
        }
        catch (err) {
            res.status(500).json({ error: "Erro ao buscar compras." });
        }
    }
};
