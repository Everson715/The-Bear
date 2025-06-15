import { Request, Response, NextFunction } from "express";
import { prisma } from "../utils/prisma";

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.headers["user-id"] as string;

    if (!userId) return res.status(401).json({ error: "ID do usuário não fornecido." });

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: "Acesso negado: apenas administradores." });
    }

    next();
  } catch (error) {
    return res.status(500).json({ error: "Erro ao verificar permissões." });
  }
};
