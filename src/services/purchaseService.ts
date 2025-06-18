// src/services/purchaseService.ts
import { prisma } from "../utils/prisma";
import NotificationService from "./NotificationService"; // Assuming default export

interface ProcessedCartItem {
  id: string; // Matches CartItem.id (UUID)
  menuItemId: number; // Matches MenuItem.id (Int)
  itemName: string;
  itemPrice: number;
  xpGain: number; // Based on schema.prisma with @default(0)
  coffeeBeansGain: number; // Based on schema.prisma with @default(0)
  quantity: number;
}

interface UserCart {
  items: ProcessedCartItem[];
  total: number;
}

function calcularNovoNivel(xp: number): string {
  if (xp >= 500) return "Urso Aventureiro";
  if (xp >= 250) return "Urso Explorador";
  if (xp >= 100) return "Urso Forrageiro";
  return "Urso Curioso";
}

export const purchaseService = {
  // userId is string (from User.id), menuItemId is number (from MenuItem.id)
  async create(userId: string, menuItemId: number) {
    const item = await prisma.menuItem.findUnique({ where: { id: menuItemId } });
    if (!item) throw new Error("Item do cardápio não encontrado.");

    const purchase = await prisma.purchase.create({
      data: {
        userId, // userId is string
        total: item.price,
        status: "Completed",
        paymentMethod: "cash", // Or a dynamic value if passed in
        items: {
          create: {
            menuItemId: item.id, // menuItemId is number
            quantity: 1,
            priceAtPurchase: item.price,
          },
        },
      },
      include: { items: true }
    });

    // Update user's XP and CoffeeBeans for this direct purchase
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user) {
      const newXp = user.xp + (item.xpGain || 0); // Use || 0 as xpGain is Int?
      const newCoffeeBeans = user.coffeeBeans + (item.coffeeBeansGain || 0); // Use || 0 as coffeeBeansGain is Int?
      const newLevel = calcularNovoNivel(newXp);

      await prisma.user.update({
        where: { id: userId },
        data: {
          xp: newXp,
          coffeeBeans: newCoffeeBeans,
          level: newLevel
        }
      });

      await NotificationService.notifyUser(
        userId,
        `Você comprou "${item.name}"! Ganhou ${item.xpGain || 0} XP e ${item.coffeeBeansGain || 0} grãos. Nível: ${newLevel}`
      );
    }
    return purchase;
  },

  async getAll() {
    return prisma.purchase.findMany({
      include: {
        user: true,
        items: { include: { menuItem: true } },
      },
    });
  },

  // userId is string
  async getCartByUserId(userId: string): Promise<UserCart> {
    const cart = await prisma.cart.findUnique({
      where: { userId }, // userId is string
      include: {
        items: { include: { menuItem: true } },
      },
    });

    if (!cart) return { items: [], total: 0 };

    const processedItems: ProcessedCartItem[] = cart.items.map(item => ({
      id: item.id, // item.id is string
      menuItemId: item.menuItemId, // menuItemId is number
      itemName: item.menuItem.name,
      itemPrice: item.menuItem.price,
      xpGain: item.menuItem.xpGain || 0,
      coffeeBeansGain: item.menuItem.coffeeBeansGain || 0,
      quantity: item.quantity,
    }));

    const total = processedItems.reduce(
      (sum, item) => sum + item.itemPrice * item.quantity,
      0
    );

    return { items: processedItems, total };
  },

  // userId is string, menuItemId is number
  async addToCart(userId: string, menuItemId: number, quantity: number) {
    const menuItem = await prisma.menuItem.findUnique({ where: { id: menuItemId } });
    if (!menuItem) throw new Error("Item do cardápio não encontrado.");

    let cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId } // userId is string
      });
    }

    const existingItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, menuItemId } // cartId is string, menuItemId is number
    });

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id }, // id is string
        data: { quantity: existingItem.quantity + quantity }
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id, // cartId is string
          menuItemId, // menuItemId is number
          quantity,
          itemName: menuItem.name, // Matches schema
          itemPrice: menuItem.price, // Matches schema
        },
      });
    }
  },

  // userId is string, cartItemId is string
  async updateCartItemQuantity(userId: string, cartItemId: string, newQuantity: number) {
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId }, // id is string
      include: { cart: true }
    });

    if (!cartItem || cartItem.cart.userId !== userId) { // cart.userId is string, userId is string
      throw new Error("Item do carrinho não encontrado ou não pertence ao usuário.");
    }

    if (newQuantity <= 0) {
      await prisma.cartItem.delete({ where: { id: cartItemId } }); // id is string
    } else {
      await prisma.cartItem.update({
        where: { id: cartItemId }, // id is string
        data: { quantity: newQuantity }
      });
    }
  },

  // userId is string, cartItemId is string
  async removeFromCart(userId: string, cartItemId: string) {
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId }, // id is string
      include: { cart: true }
    });

    if (!cartItem || cartItem.cart.userId !== userId) { // cart.userId is string, userId is string
      throw new Error("Item do carrinho não encontrado ou não pertence ao usuário.");
    }

    await prisma.cartItem.delete({ where: { id: cartItemId } }); // id is string
  },

  // userId is string
  async checkoutCart(userId: string, paymentMethod: 'cash' | 'coffeeBeans') {
    const cart = await prisma.cart.findUnique({
      where: { userId }, // userId is string
      include: { items: { include: { menuItem: true } } },
    });

    if (!cart || cart.items.length === 0) {
      throw new Error("Carrinho vazio. Adicione itens antes de finalizar a compra.");
    }

    let totalAmount = 0;
    let totalXp = 0;
    let totalBeans = 0;
    let costInBeans = 0;

    const orderItemsData = cart.items.map(item => {
      const xp = item.menuItem.xpGain || 0;
      const beans = item.menuItem.coffeeBeansGain || 0;

      totalAmount += item.itemPrice * item.quantity;
      totalXp += xp * item.quantity;
      totalBeans += beans * item.quantity;
      costInBeans += xp * item.quantity;

      return {
        menuItemId: item.menuItemId, // menuItemId is number
        quantity: item.quantity,
        priceAtPurchase: item.itemPrice,
      };
    });

    const user = await prisma.user.findUnique({
      where: { id: userId }, // userId is string
      select: { xp: true, coffeeBeans: true, level: true }
    });

    if (!user) throw new Error("Usuário não encontrado.");

    let newBeans = user.coffeeBeans;

    if (paymentMethod === 'coffeeBeans') {
      if (newBeans < costInBeans) {
        throw new Error(`Grãos insuficientes: você tem ${newBeans}, precisa de ${costInBeans}.`);
      }
      newBeans -= costInBeans;
    }

    newBeans += totalBeans;
    const newXp = user.xp + totalXp;
    const newLevel = calcularNovoNivel(newXp);

    const newPurchase = await prisma.purchase.create({
      data: {
        userId, // userId is string
        total: totalAmount,
        status: "Completed",
        paymentMethod,
        items: { createMany: { data: orderItemsData } }
      },
      include: { items: true }
    });

    await prisma.user.update({
      where: { id: userId }, // userId is string
      data: {
        xp: newXp,
        coffeeBeans: newBeans,
        level: newLevel,
      },
    });

    // Clear the user's cart after successful checkout
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id } // cart.id is string
    });

    await NotificationService.notifyUser(
      userId,
      `Compra finalizada! +${totalXp} XP, +${totalBeans} grãos. Nível: ${newLevel}.`
    );

    return newPurchase;
  },

  // userId is string
  async getUserPurchases(userId: string) {
    return prisma.purchase.findMany({
      where: { userId }, // userId is string
      include: {
        items: { include: { menuItem: true } },
      },
      orderBy: { createdAt: 'desc' }
    });
  },

  // userId is string, menuItemId is number
  async buyItemWithCoffeeBeans(userId: string, menuItemId: number) {
    const item = await prisma.menuItem.findUnique({ where: { id: menuItemId } }); // menuItemId is number
    if (!item) throw new Error("Item do cardápio não encontrado.");

    const costInBeans = item.xpGain || 0; // Use || 0 as xpGain is Int?

    const user = await prisma.user.findUnique({
      where: { id: userId }, // userId is string
      select: { xp: true, coffeeBeans: true, level: true },
    });

    if (!user) throw new Error("Usuário não encontrado.");
    if (user.coffeeBeans < costInBeans) {
      throw new Error(`Grãos insuficientes: tem ${user.coffeeBeans}, precisa de ${costInBeans}.`);
    }

    const newXp = user.xp + (item.xpGain || 0); // Use || 0 as xpGain is Int?
    const newBeans = user.coffeeBeans - costInBeans + (item.coffeeBeansGain || 0); // Use || 0 as coffeeBeansGain is Int?
    const newLevel = calcularNovoNivel(newXp);

    const purchase = await prisma.purchase.create({
      data: {
        userId, // userId is string
        total: item.price,
        status: "Completed",
        paymentMethod: "coffeeBeans",
        items: {
          create: {
            menuItemId: item.id, // menuItemId is number
            quantity: 1,
            priceAtPurchase: item.price,
          },
        },
      },
      include: { items: true }
    });

    await prisma.user.update({
      where: { id: userId }, // userId is string
      data: {
        xp: newXp,
        coffeeBeans: newBeans,
        level: newLevel,
      },
    });

    await NotificationService.notifyUser(
      userId,
      `Você comprou "${item.name}" com grãos! Ganhou ${item.xpGain || 0} XP, ${item.coffeeBeansGain || 0} grãos. Nível: ${newLevel}`
    );

    return purchase;
  }
};