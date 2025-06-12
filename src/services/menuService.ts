import { prisma } from "../utils/prisma";

export const menuService = {
  async getAll() {
    return prisma.menuItem.findMany();
  },

  async create(data: { name: string; category: string; price: number }) {
    return prisma.menuItem.create({ data });
  }
};
