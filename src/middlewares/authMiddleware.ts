// src/middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

// Adicionar esta declaração global para estender a interface Request do Express
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload; // Define que req.user pode ser do tipo JwtPayload (ou sua interface de usuário)
    }
  }
}

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
    // IMPORTANTE: Seu segredo JWT (process.env.JWT_SECRET) deve ser o MESMO usado para assinar o token no login!
    const decoded = jwt.verify(token, "secreta-do-bear") as JwtPayload; // Verifique o nome do segredo

    // Adiciona as informações decodificadas do usuário ao objeto req
    req.user = decoded; // Agora TypeScript reconhece req.user

    next(); // Continua para a próxima função middleware ou rota
  } catch (e: any) {
    console.error("authMiddleware: Erro na verificação do token:", e.message);
    // Erros comuns: TokenExpiredError, JsonWebTokenError (token malformado)
    return res.status(401).json({ error: "Token inválido ou expirado." });
  }
}