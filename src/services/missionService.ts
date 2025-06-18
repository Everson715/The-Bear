// src/services/MissionService.ts
import { prisma } from "../utils/prisma";

interface MissionCreateData {
  title: string;
  description?: string;
  category: string; // Ex: "Daily", "Weekly", "Special"
  requiredCategories?: string; // Ex: "Bebidas com café,Chás"
}

interface MissionUpdateData {
  title?: string;
  description?: string;
  category?: string;
  requiredCategories?: string;
}

export class MissionService {
  async getAllMissions() {
    return await prisma.mission.findMany();
  }

  async getMissionById(id: number) {
    return await prisma.mission.findUnique({
      where: { id },
    });
  }

  async createMission(data: MissionCreateData) {
    return await prisma.mission.create({ data });
  }

  async updateMission(id: number, data: MissionUpdateData) {
    return await prisma.mission.update({
      where: { id },
      data,
    });
  }

  async deleteMission(id: number) {
    // Ao deletar uma missão, também deletamos suas associações em UserMission
    await prisma.userMission.deleteMany({
      where: { missionId: id }
    });
    return await prisma.mission.delete({
      where: { id },
    });
  }

  // Métodos para o usuário completar missões (se ainda não tiver em UserMissionService)
  async completeUserMission(userId: string, missionId: number) {
    // Primeiro, verifica se a missão existe
    const mission = await prisma.mission.findUnique({ where: { id: missionId } });
    if (!mission) {
      throw new Error("Missão não encontrada.");
    }

    // Marca a missão como completa para o usuário
    const userMission = await prisma.userMission.update({
      where: {
        userId_missionId: {
          userId: userId,
          missionId: missionId,
        },
      },
      data: {
        completed: true,
      },
    });
    
    /*
    if (mission.xpReward) {
      await prisma.user.update({
        where: { id: userId },
        data: { xp: { increment: mission.xpReward } }
      });
    }
    */

    return userMission;
  }

  async getUserMissions(userId: string) {
    return await prisma.userMission.findMany({
      where: { userId },
      include: {
        mission: true, // Inclui os detalhes da missão
      },
    });
  }
}