// src/services/purchaseService.ts
import { prisma } from "../utils/prisma";
import NotificationService from "./NotificationService";
import { validateCombo } from "../utils/validateCombo"; // Assumindo que você tem isso

interface CartItem {
  id: string;
  menuItemId: number;
  itemName: string;
  itemPrice: number;
  quantity: number;
  menuItem: { // Adicionado para acessar xpGain e coffeeBeansGain aqui
    xpGain: number | null;
    coffeeBeansGain: number | null;
  };
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
  async create(userId: string, menuItemId: number) {
    const item = await prisma.menuItem.findUnique({
      where: { id: menuItemId },
    });
    if (!item) throw new Error("Item do cardápio não encontrado.");

    const purchase = await prisma.purchase.create({
      data: {
        userId,
        total: item.price,
        status: "Completed",
        paymentMethod: "cash", // Assumindo cash para compra rápida
        items: {
          create: {
            menuItemId: item.id, // Corrigido: Usar item.id diretamente, que é Int
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
    return prisma.purchase.findMany({
      include: {
        user: true,
        items: {
          include: {
            menuItem: true,
          },
        },
      },
    });
  },

  // --- MÉTODOS DE GERENCIAMENTO DE CARRINHO ---

  async getCartByUserId(userId: string): Promise<UserCart> {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            menuItem: true, // Incluir menuItem para acessar xpGain/coffeeBeansGain no frontend
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
      menuItem: { // Incluir menuItem diretamente para acesso ao xpGain/coffeeBeansGain
        xpGain: item.menuItem.xpGain,
        coffeeBeansGain: item.menuItem.coffeeBeansGain,
      }
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

  async checkoutCart(userId: string, paymentMethod: 'cash' | 'coffeeBeans') {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { menuItem: true } } },
    });

    if (!cart || cart.items.length === 0) {
      throw new Error("Carrinho vazio. Adicione itens antes de finalizar a compra.");
    }

    let totalAmount = 0; // Custo em dinheiro
    let totalXpGanhos = 0;
    let totalGraosGanhos = 0; // Grãos ganhos ao comprar
    let totalCostInCoffeeBeans = 0; // Custo em grãos de café para a compra (se pagar com grãos)

    const orderItemsData = cart.items.map((item) => {
      const xpGanhosItem = item.menuItem.xpGain || 0;
      const graosGanhosItem = item.menuItem.coffeeBeansGain || 0;

      totalAmount += item.itemPrice * item.quantity;
      totalXpGanhos += xpGanhosItem * item.quantity;
      totalGraosGanhos += graosGanhosItem * item.quantity;

      // O custo em grãos de café para COMPRAR o item é o xpGain do item
      totalCostInCoffeeBeans += (item.menuItem.xpGain || 0) * item.quantity;

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

    let newCoffeeBeansBalance = user.coffeeBeans; // Começa com o saldo atual do usuário

    if (paymentMethod === 'coffeeBeans') {
      if (user.coffeeBeans < totalCostInCoffeeBeans) {
        throw new Error(`Grãos de café insuficientes. Você tem ${user.coffeeBeans}, mas precisa de ${totalCostInCoffeeBeans}.`);
      }
      newCoffeeBeansBalance -= totalCostInCoffeeBeans; // Deduz os grãos usados na compra
    }

    newCoffeeBeansBalance += totalGraosGanhos; // Adiciona os grãos ganhos com a compra

    const novoXP = user.xp + totalXpGanhos;
    const novoNivel = calcularNovoNivel(novoXP);

    const newPurchase = await prisma.purchase.create({
      data: {
        userId,
        total: totalAmount,
        status: "Completed",
        paymentMethod: paymentMethod,
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
        coffeeBeans: newCoffeeBeansBalance, // Atualiza com o novo saldo de grãos
        level: novoNivel,
      },
    });

    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    await validateCombo(); // Assumindo que essa função existe

    await NotificationService.notifyUser(
      userId,
      `Sua compra de R$ ${totalAmount.toFixed(2)} (Pago com ${paymentMethod === 'cash' ? 'dinheiro' : 'grãos'}) foi finalizada! Você ganhou ${totalXpGanhos} XP e ${totalGraosGanhos} grãos extras. Nível atual: ${novoNivel}`
    );

    return newPurchase;
  },

  async getUserPurchases(userId: string) {
    return prisma.purchase.findMany({
      where: { userId: userId },
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      }
    });
  },

  async buyItemWithCoffeeBeans(userId: string, menuItemId: number) {
    const item = await prisma.menuItem.findUnique({
      where: { id: menuItemId },
    });
    if (!item) throw new Error("Item do cardápio não encontrado.");

    const costInCoffeeBeans = item.xpGain || 0; // Usando XP como custo em grãos para este exemplo

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { xp: true, coffeeBeans: true, level: true },
    });

    if (!user) {
      throw new Error("Usuário não encontrado.");
    }

    if (user.coffeeBeans < costInCoffeeBeans) {
      throw new Error(`Grãos de café insuficientes. Você tem ${user.coffeeBeans}, mas precisa de ${costInCoffeeBeans}.`);
    }

    const newXP = user.xp + (item.xpGain || 0);
    const newCoffeeBeans = user.coffeeBeans - costInCoffeeBeans + (item.coffeeBeansGain || 0);
    const newLevel = calcularNovoNivel(newXP);

    const purchase = await prisma.purchase.create({
      data: {
        userId,
        total: item.price,
        status: "Completed",
        paymentMethod: "coffeeBeans",
        items: {
          create: {
            menuItemId: item.id, // Corrigido aqui também
            quantity: 1,
            priceAtPurchase: item.price,
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
        xp: newXP,
        coffeeBeans: newCoffeeBeans,
        level: newLevel,
      },
    });

    await NotificationService.notifyUser(
      userId,
      `Você comprou "${item.name}" com ${costInCoffeeBeans} grãos! Ganhou ${item.xpGain} XP e ${item.coffeeBeansGain} grãos extras. Nível atual: ${newLevel}`
    );

    return purchase;
  }
};