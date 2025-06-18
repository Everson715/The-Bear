// src/services/UserService.ts
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../utils/prisma";

const jwtSecret = process.env.JWT_SECRET || "secreta-do-bear";

export class UserService {
  async register(name: string, email: string, password: string) {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error("E-mail já cadastrado");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        xp: 0,
        coffeeBeans: 0,
        level: "Urso Curioso",
      },
    });
  }

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        xp: true,
        coffeeBeans: true,
        level: true,
        isAdmin: true,
      },
    });

    if (!user) throw new Error("Email ou senha inválidos");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Email ou senha inválidos");

    const token = jwt.sign(
      { userId: user.id, isAdmin: user.isAdmin },
      jwtSecret,
      { expiresIn: "1d" }
    );

    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token,
    };
  }

  async findById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        purchases: true,
        notifications: true,
      },
    });

    if (!user) {
      throw new Error("Usuário não encontrado.");
    }
    return user;
  }

  // Novo método para pegar perfil resumido (dashboard)
  async getProfile(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        xp: true,
        coffeeBeans: true,
        level: true,
        isAdmin: true,
      },
    });
  }
}
