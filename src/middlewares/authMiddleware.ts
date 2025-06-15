import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).json({ error: "Token não enviado." });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, "secreta-do-bear") as JwtPayload; // <- TIPAGEM AQUI
    req.user = decoded;
    next();
  } catch (e) {
    res.status(401).json({ error: "Token inválido ou expirado." });
  }
}
