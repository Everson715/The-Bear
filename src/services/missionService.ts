import { prisma } from "../utils/prisma";
import NotificationService from "./NotificationService";

// Transforma string CSV ou JSON em array
function parseRequiredCategories(raw: string | null | undefined): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return raw.split(",").map(c => c.trim());
  }
}

export const missionService = {
  async create(data: { title: string; description?: string; requiredCategories?: string }) {
    return await prisma.mission.create({ data });
  },

  async getAll() {
    return await prisma.mission.findMany();
  },

  async complete(userId: string, missionId: number) {
    const userMission = await prisma.userMission.upsert({
      where: {
        userId_missionId: {
          userId,
          missionId
        }
      },
      update: { completed: true },
      create: { userId, missionId, completed: true }
    });

    await NotificationService.notifyUser(userId, `Missão concluída: ID ${missionId}`);
    return userMission;
  },

  async checkAndGetMissions(userId: string) {
    const userPurchases = await prisma.purchase.findMany({
      where: { userId },
      include: { menuItem: true }
    });

    const userItemsCategories = userPurchases
      .map(p => p.menuItem?.category)
      .filter((cat): cat is string => !!cat);

    const userMissions = await prisma.userMission.findMany({ where: { userId } });
    const allMissions = await prisma.mission.findMany();

    for (const mission of allMissions) {
      const userMissionEntry = userMissions.find(um => um.missionId === mission.id);
      if (userMissionEntry?.completed) continue;

      const requiredCats = parseRequiredCategories(mission.requiredCategories);
      if (requiredCats.length === 0) continue;

      const hasAllCategories = requiredCats.every(cat => userItemsCategories.includes(cat));

      if (hasAllCategories) {
        await prisma.userMission.upsert({
          where: {
            userId_missionId: {
              userId,
              missionId: mission.id
            }
          },
          update: { completed: true },
          create: { userId, missionId: mission.id, completed: true }
        });

        await NotificationService.notifyUser(
          userId,
          `Parabéns! Você concluiu a missão: ${mission.title}`
        );
      }
    }

    const finalUserMissions = await prisma.userMission.findMany({
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
