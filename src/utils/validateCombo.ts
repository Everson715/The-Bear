import { prisma } from "./prisma";

export async function validateCombo() {
  const purchases = await prisma.purchase.findMany({
    orderBy: { createdAt: "desc" },
    include: { menuItem: true }
  });

  const recent = purchases.slice(0, 3);

  const categorias = recent.map(p => p.menuItem.category);

  const hasCombo = categorias.includes("bebida") &&
                   categorias.includes("sobremesa") &&
                   categorias.includes("salgado");

  if (hasCombo) {
    await prisma.mission.updateMany({
      where: { category: "combo", completed: false },
      data: { completed: true }
    });
  }
}
