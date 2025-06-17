// src/middlewares/isAdmin.ts
import { Request, Response, NextFunction } from "express";
import { prisma } from "../utils/prisma";

export async function isAdmin(req: Request, res: Response, next: NextFunction) {
  const userId = req.headers["user-id"] as string;

  if (!userId) {
    return res.status(401).json({ error: "ID do usuário não fornecido" });
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user || !user.isAdmin) {
    return res.status(403).json({ error: "Acesso negado: apenas administradores" });
  }

  next();
}
