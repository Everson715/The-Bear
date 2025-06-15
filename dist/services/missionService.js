"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.missionService = void 0;
const prisma_1 = require("../utils/prisma");
const NotificationService_1 = __importDefault(require("./NotificationService"));
// Transforma string CSV ou JSON em array
function parseRequiredCategories(raw) {
    if (!raw)
        return [];
    try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    }
    catch {
        return raw.split(",").map(c => c.trim());
    }
}
exports.missionService = {
    async create(data) {
        return await prisma_1.prisma.mission.create({ data });
    },
    async getAll() {
        return await prisma_1.prisma.mission.findMany();
    },
    async complete(userId, missionId) {
        const userMission = await prisma_1.prisma.userMission.upsert({
            where: {
                userId_missionId: {
                    userId,
                    missionId
                }
            },
            update: { completed: true },
            create: { userId, missionId, completed: true }
        });
        await NotificationService_1.default.notifyUser(userId, `Missão concluída: ID ${missionId}`);
        return userMission;
    },
    async checkAndGetMissions(userId) {
        const userPurchases = await prisma_1.prisma.purchase.findMany({
            where: { userId },
            include: { menuItem: true }
        });
        const userItemsCategories = userPurchases
            .map(p => p.menuItem?.category)
            .filter((cat) => !!cat);
        const userMissions = await prisma_1.prisma.userMission.findMany({ where: { userId } });
        const allMissions = await prisma_1.prisma.mission.findMany();
        for (const mission of allMissions) {
            const userMissionEntry = userMissions.find(um => um.missionId === mission.id);
            if (userMissionEntry?.completed)
                continue;
            const requiredCats = parseRequiredCategories(mission.requiredCategories);
            if (requiredCats.length === 0)
                continue;
            const hasAllCategories = requiredCats.every(cat => userItemsCategories.includes(cat));
            if (hasAllCategories) {
                await prisma_1.prisma.userMission.upsert({
                    where: {
                        userId_missionId: {
                            userId,
                            missionId: mission.id
                        }
                    },
                    update: { completed: true },
                    create: { userId, missionId: mission.id, completed: true }
                });
                await NotificationService_1.default.notifyUser(userId, `Parabéns! Você concluiu a missão: ${mission.title}`);
            }
        }
        const finalUserMissions = await prisma_1.prisma.userMission.findMany({
            where: { userId },
            include: { mission: true }
        });
        return finalUserMissions.map(um => ({
            id: um.missionId,
            title: um.mission.title,
            completed: um.completed
        }));
    }
};
