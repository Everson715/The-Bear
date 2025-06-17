import { prisma } from "../utils/prisma";

interface MenuItemData {
  name: string;
  category: string;
  price: number;
  imageUrl: string;
  description?: string;
}

interface MenuItemUpdateData {
  name?: string;
  category?: string;
  price?: number;
  imageUrl?: string;
  description?: string;
}

export class MenuItemService {
  async getAll() {
    return await prisma.menuItem.findMany();
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
