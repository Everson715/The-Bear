"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCombo = validateCombo;
const prisma_1 = require("./prisma");
async function validateCombo() {
    const purchases = await prisma_1.prisma.purchase.findMany({
        orderBy: { createdAt: "desc" },
        include: { menuItem: true }
    });
    const recent = purchases.slice(0, 3);
    const categorias = recent.map(p => p.menuItem.category);
    const hasCombo = categorias.includes("bebida") &&
        categorias.includes("sobremesa") &&
        categorias.includes("salgado");
    if (hasCombo) {
        await prisma_1.prisma.mission.updateMany({
            where: { category: "combo", completed: false },
            data: { completed: true }
        });
    }
}
