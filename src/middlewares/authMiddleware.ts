// src/middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Token de autenticação não fornecido." });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Formato de token inválido." });
  }

  try {
    const secret = process.env.JWT_SECRET || "secreta-do-bear";
    const decoded = jwt.verify(token, secret) as JwtPayload;

    req.user = {
      userId: decoded.userId as string,
      isAdmin: decoded.isAdmin as boolean,
    };

    next();
  } catch (e: any) {
    console.error("authMiddleware: Erro na verificação do token:", e.message);
    return res.status(401).json({ error: "Token inválido ou expirado." });
  }
}
