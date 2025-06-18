// src/services/MenuItemService.ts
import { prisma } from "../utils/prisma";

interface MenuItemData {
  name: string;
  category: string;
  price: number;
  imageUrl?: string;
  description?: string;
  xpGain?: number;
  coffeeBeansGain?: number;
}

interface MenuItemUpdateData {
  name?: string;
  category?: string;
  price?: number;
  imageUrl?: string;
  description?: string;
  xpGain?: number;
  coffeeBeansGain?: number;
}

export class MenuItemService {
  async getAll() {
    return await prisma.menuItem.findMany();
  }

  async getById(id: number) {
    return await prisma.menuItem.findUnique({
      where: { id },
    });
  }

  async getCategories() {
    const categories = await prisma.menuItem.findMany({
      select: {
        category: true,
      },
      distinct: ['category'],
    });
    return categories.map(item => item.category).filter(Boolean);
  }

  async create(data: MenuItemData) {
    return await prisma.menuItem.create({ data });
  }

  async update(id: number, data: MenuItemUpdateData) {
    return await prisma.menuItem.update({
      where: { id },
      data
    });
  }

  async remove(id: number) {
    return await prisma.menuItem.delete({
      where: { id }
    });
  }
}