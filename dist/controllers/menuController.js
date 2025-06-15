"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.menuController = void 0;
const MenuItemService_1 = require("../services/MenuItemService");
const service = new MenuItemService_1.MenuItemService();
exports.menuController = {
    async getAll(req, res) {
        const items = await service.getAll();
        res.json(items);
    },
    async create(req, res) {
        try {
            const { name, category, price, image, description } = req.body;
            const newItem = await service.create({ name, category, price, image, description });
            res.status(201).json(newItem);
        }
        catch (e) {
            res.status(400).json({ error: e.message });
        }
    },
    async update(req, res) {
        try {
            const { id } = req.params;
            const { name, category, price, image, description } = req.body;
            const updated = await service.update(+id, { name, category, price, image, description });
            res.json(updated);
        }
        catch (e) {
            res.status(400).json({ error: e.message });
        }
    },
    async remove(req, res) {
        try {
            const { id } = req.params;
            await service.remove(+id);
            res.status(204).end();
        }
        catch (e) {
            res.status(400).json({ error: e.message });
        }
    }
};
