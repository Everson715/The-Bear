// src/middlewares/isAdmin.ts
import { Request, Response, NextFunction } from "express";

export async function isAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ error: "Acesso negado: apenas administradores." });
  }
  next();
}