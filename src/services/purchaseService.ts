import { prisma } from "../utils/prisma";
import { validateCombo } from "../utils/validateCombo";

export const purchaseService = {
  async create(menuItemId: number) {
    const purchase = await prisma.purchase.create({
      data: { menuItemId }
    });

    await validateCombo();

    return purchase;
  },

  async getAll() {
    return prisma.purchase.findMany({ include: { menuItem: true } });
  }
};
