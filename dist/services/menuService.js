"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.menuService = void 0;
const prisma_1 = require("../utils/prisma");
exports.menuService = {
    async getAll() {
        return prisma_1.prisma.menuItem.findMany();
    },
    async create(data) {
        return prisma_1.prisma.menuItem.create({ data });
    }
};
