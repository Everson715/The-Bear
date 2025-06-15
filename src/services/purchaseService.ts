import { prisma } from "../utils/prisma";
import { validateCombo } from "../utils/validateCombo";
import NotificationService from "./NotificationService";

export const purchaseService = {
  async create(userId: string, menuItemId: number) {
    const purchase = await prisma.purchase.create({
      data: {
        userId,
        menuItemId,
      },
    });

    await validateCombo();

    await NotificationService.notifyUser(
      userId,
      "Compra registrada! Você ganhou 10 XP e 1 grão."
    );

    return purchase;
  },

  async getAll() {
    return prisma.purchase.findMany({
      include: { menuItem: true },
    });
  },
};
