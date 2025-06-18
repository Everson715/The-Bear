import { prisma } from "./prisma";

export async function validateCombo() {
  try {
    const recentPurchases = await prisma.purchase.findMany({
      orderBy: { createdAt: "desc" },
      take: 3,
      include: { menuItem: true }
    });

    if (recentPurchases.length < 3) return;

    const categorias = recentPurchases
      .map(p => p.menuItem?.category)
      .filter((cat): cat is string => typeof cat === "string");

    const hasCombo = ["bebida", "sobremesa", "salgado"].every(cat =>
      categorias.includes(cat)
    );

    if (hasCombo) {
      await prisma.userMission.updateMany({
        where: {
          completed: false,
          mission: {
            // Adicione esse campo ao seu schema.prisma
            // caso ainda não exista:
            // category String?
            category: "combo"
          }
        },
        data: {
          completed: true
        }
      });
    }
  } catch (error) {
    console.error("Erro ao validar combo:", error);
  }
}
