// src/services/purchaseService.ts
import { prisma } from "../utils/prisma";
import NotificationService from "./NotificationService";
import { validateCombo } from "../utils/validateCombo";

function calcularNovoNivel(xp: number): string {
  if (xp >= 500) return "Urso Aventureiro";
  if (xp >= 250) return "Urso Explorador";
  if (xp >= 100) return "Urso Forrageiro";
  return "Urso Curioso";
}

export const purchaseService = {
  async create(userId: string, menuItemId: number) {
    // Busca o item do cardápio
    const item = await prisma.menuItem.findUnique({
      where: { id: menuItemId },
    });
    if (!item) throw new Error("Item do cardápio não encontrado.");

    // Busca o usuário
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        xp: true,
        coffeeBeans: true,
        level: true,
      },
    });
    if (!user) throw new Error("Usuário não encontrado.");

    // Calcula XP e grãos ganhos com base no preço do item
    const xpGanhos = Math.floor(item.price);
    const graosGanhos = Math.floor(item.price / 2);

    const novoXP = user.xp + xpGanhos;
    const novosGraos = user.coffeeBeans + graosGanhos;
    const novoNivel = calcularNovoNivel(novoXP);

    // Atualiza usuário com novos valores
    await prisma.user.update({
      where: { id: userId },
      data: {
        xp: novoXP,
        coffeeBeans: novosGraos,
        level: novoNivel,
      },
    });

    // Cria a compra
    const purchase = await prisma.purchase.create({
      data: {
        userId,
        menuItemId,
      },
    });

    // Validação de combos, se necessário
    await validateCombo();

    // Notificação ao usuário
    await NotificationService.notifyUser(
      userId,
      `Você comprou "${item.name}" e ganhou ${xpGanhos} XP e ${graosGanhos} grãos! Nível atual: ${novoNivel}`
    );

    return purchase;
  },

  async getAll() {
    return prisma.purchase.findMany({
      include: { menuItem: true },
    });
  },
};
