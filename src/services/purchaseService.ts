// src/services/purchaseService.ts
import { prisma } from "../utils/prisma";
import NotificationService from "./NotificationService";
import { validateCombo } from "../utils/validateCombo";

interface CartItem {
  id: string;
  menuItemId: number;
  itemName: string;
  itemPrice: number;
  quantity: number;
}

interface UserCart {
  items: CartItem[];
  total: number;
}

function calcularNovoNivel(xp: number): string {
  if (xp >= 500) return "Urso Aventureiro";
  if (xp >= 250) return "Urso Explorador";
  if (xp >= 100) return "Urso Forrageiro";
  return "Urso Curioso";
}

export const purchaseService = {
  // ATENÇÃO: Se este método 'create' é para uma "compra rápida" de 1 item, use esta versão.
  // Se TODAS as compras devem passar pelo carrinho, você pode REMOVER este método 'create'.
  async create(userId: string, menuItemId: number) {
    const item = await prisma.menuItem.findUnique({
      where: { id: menuItemId },
    });
    if (!item) throw new Error("Item do cardápio não encontrado.");

    // Cria um pedido 'Purchase' com um único 'PurchaseItem'
    const purchase = await prisma.purchase.create({
      data: {
        userId,
        total: item.price,
        status: "Completed",
        items: {
          create: {
            menuItemId: item.id,
            quantity: 1,
            priceAtPurchase: item.price,
          },
        },
      },
      include: {
        items: true,
      }
    });

    await NotificationService.notifyUser(
      userId,
      `Você comprou "${item.name}"!`
    );

    return purchase;
  },

  async getAll() {
    // CORREÇÃO AQUI: Agora inclui 'items' e dentro de 'items', inclui 'menuItem'
    return prisma.purchase.findMany({
      include: {
        user: true, // Opcional: incluir informações do usuário que fez a compra
        items: {
          include: {
            menuItem: true, // Incluir os detalhes do menuItem através do PurchaseItem
          },
        },
      },
    });
  },

  // --- MÉTODOS DE GERENCIAMENTO DE CARRINHO (JÁ ESTÃO CORRETOS PARA MULTI-ITENS) ---

  async getCartByUserId(userId: string): Promise<UserCart> {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
      },
    });

    if (!cart) {
      return { items: [], total: 0 };
    }

    const processedItems: CartItem[] = cart.items.map((item) => ({
      id: item.id,
      menuItemId: item.menuItemId,
      itemName: item.menuItem.name,
      itemPrice: item.menuItem.price,
      quantity: item.quantity,
    }));

    const total = processedItems.reduce(
      (sum, item) => sum + item.itemPrice * item.quantity,
      0
    );

    return { items: processedItems, total };
  },

  async addToCart(userId: string, menuItemId: number, quantity: number) {
    const menuItem = await prisma.menuItem.findUnique({
      where: { id: menuItemId },
    });
    if (!menuItem) {
      throw new Error("Item do cardápio não encontrado.");
    }

    let cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
      });
    }

    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        menuItemId: menuItemId,
      },
    });

    if (existingCartItem) {
      await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: {
          quantity: existingCartItem.quantity + quantity,
        },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          menuItemId: menuItemId,
          quantity: quantity,
          itemName: menuItem.name,
          itemPrice: menuItem.price,
        },
      });
    }
  },

  async updateCartItemQuantity(
    userId: string,
    cartItemId: string,
    newQuantity: number
  ) {
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: { cart: true },
    });

    if (!cartItem || cartItem.cart.userId !== userId) {
      throw new Error("Item do carrinho não encontrado ou não pertence ao usuário.");
    }

    if (newQuantity <= 0) {
      await prisma.cartItem.delete({
        where: { id: cartItemId },
      });
    } else {
      await prisma.cartItem.update({
        where: { id: cartItemId },
        data: { quantity: newQuantity },
      });
    }
  },

  async removeFromCart(userId: string, cartItemId: string) {
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: { cart: true },
    });

    if (!cartItem || cartItem.cart.userId !== userId) {
      throw new Error("Item do carrinho não encontrado ou não pertence ao usuário.");
    }

    await prisma.cartItem.delete({
      where: { id: cartItemId },
    });
  },

  async checkoutCart(userId: string) {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { menuItem: true } } },
    });

    if (!cart || cart.items.length === 0) {
      throw new Error("Carrinho vazio. Adicione itens antes de finalizar a compra.");
    }

    let totalAmount = 0;
    let totalXpGanhos = 0;
    let totalGraosGanhos = 0;
    const orderItemsData = cart.items.map((item) => {
      const xpGanhosItem = Math.floor(item.menuItem.price);
      const graosGanhosItem = Math.floor(item.menuItem.price / 2);

      totalAmount += item.itemPrice * item.quantity;
      totalXpGanhos += xpGanhosItem * item.quantity;
      totalGraosGanhos += graosGanhosItem * item.quantity;

      return {
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        priceAtPurchase: item.itemPrice,
      };
    });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { xp: true, coffeeBeans: true, level: true },
    });

    if (!user) {
      throw new Error("Usuário não encontrado.");
    }

    const novoXP = user.xp + totalXpGanhos;
    const novosGraos = user.coffeeBeans + totalGraosGanhos;
    const novoNivel = calcularNovoNivel(novoXP);

    const newPurchase = await prisma.purchase.create({
      data: {
        userId,
        total: totalAmount,
        status: "Completed",
        items: {
          createMany: {
            data: orderItemsData,
          },
        },
      },
      include: {
        items: true,
      }
    });

    await prisma.user.update({
      where: { id: userId },
      data: {
        xp: novoXP,
        coffeeBeans: novosGraos,
        level: novoNivel,
      },
    });

    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    await validateCombo();

    await NotificationService.notifyUser(
      userId,
      `Sua compra de R$ ${totalAmount.toFixed(2)} foi finalizada! Você ganhou ${totalXpGanhos} XP e ${totalGraosGanhos} grãos. Nível atual: ${novoNivel}`
    );

    return newPurchase;
  },
};