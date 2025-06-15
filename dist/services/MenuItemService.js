"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuItemService = void 0;
const prisma_1 = require("../utils/prisma");
class MenuItemService {
    async getAll() {
        return prisma_1.prisma.menuItem.findMany();
    }
    async create(data) {
        return prisma_1.prisma.menuItem.create({ data });
    }
    async update(id, data) {
        return prisma_1.prisma.menuItem.update({
            where: { id },
            data
        });
    }
    async remove(id) {
        return prisma_1.prisma.menuItem.delete({
            where: { id }
        });
    }
}
exports.MenuItemService = MenuItemService;
