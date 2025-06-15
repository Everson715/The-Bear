import { prisma } from "../utils/prisma";

export class MenuItemService {
  async getAll() {
    return prisma.menuItem.findMany();
  }

  async create(data: {
    name: string;
    category: string;
    price: number;
    imageUrl: string;
    description?: string;
  }) {
    return prisma.menuItem.create({ data });
  }

  async update(id: number, data: {
    name?: string;
    category?: string;
    price?: number;
    imageUrl?: string;
    description?: string;
  }) {
    return prisma.menuItem.update({
      where: { id },
      data
    });
  }

  async remove(id: number) {
    return prisma.menuItem.delete({
      where: { id }
    });
  }
}
