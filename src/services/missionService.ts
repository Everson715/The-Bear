import { prisma } from "../utils/prisma";

export const missionService = {
  async create(data: { description: string; category: string }) {
    return prisma.mission.create({ data });
  },

  async getAll() {
    return prisma.mission.findMany();
  },

  async complete(id: number) {
    return prisma.mission.update({
      where: { id },
      data: { completed: true }
    });
  }
};
