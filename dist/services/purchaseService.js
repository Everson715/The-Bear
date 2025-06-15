"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.purchaseService = void 0;
// src/services/purchaseService.ts
const prisma_1 = require("../utils/prisma");
const NotificationService_1 = __importDefault(require("./NotificationService"));
const validateCombo_1 = require("../utils/validateCombo");
function calcularNovoNivel(xp) {
    if (xp >= 500)
        return "Urso Aventureiro";
    if (xp >= 250)
        return "Urso Explorador";
    if (xp >= 100)
        return "Urso Forrageiro";
    return "Urso Curioso";
}
exports.purchaseService = {
    async create(userId, menuItemId) {
        // Busca o item do cardápio
        const item = await prisma_1.prisma.menuItem.findUnique({
            where: { id: menuItemId },
        });
        if (!item)
            throw new Error("Item do cardápio não encontrado.");
        // Busca o usuário
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                xp: true,
                coffeeBeans: true,
                level: true,
            },
        });
        if (!user)
            throw new Error("Usuário não encontrado.");
        // Calcula XP e grãos ganhos com base no preço do item
        const xpGanhos = Math.floor(item.price);
        const graosGanhos = Math.floor(item.price / 2);
        const novoXP = user.xp + xpGanhos;
        const novosGraos = user.coffeeBeans + graosGanhos;
        const novoNivel = calcularNovoNivel(novoXP);
        // Atualiza usuário com novos valores
        await prisma_1.prisma.user.update({
            where: { id: userId },
            data: {
                xp: novoXP,
                coffeeBeans: novosGraos,
                level: novoNivel,
            },
        });
        // Cria a compra
        const purchase = await prisma_1.prisma.purchase.create({
            data: {
                userId,
                menuItemId,
            },
        });
        // Validação de combos, se necessário
        await (0, validateCombo_1.validateCombo)();
        // Notificação ao usuário
        await NotificationService_1.default.notifyUser(userId, `Você comprou "${item.name}" e ganhou ${xpGanhos} XP e ${graosGanhos} grãos! Nível atual: ${novoNivel}`);
        return purchase;
    },
    async getAll() {
        return prisma_1.prisma.purchase.findMany({
            include: { menuItem: true },
        });
    },
};
