// src/controllers/UserController.ts
import { Request, Response } from "express";
import { UserService } from "../services/UserService";

// IMPORTANTE: Adicione esta declaração global em um arquivo .d.ts (ex: src/types/express.d.ts)
// para que req.user seja reconhecido globalmente.
// NÃO é recomendado colocar esta declaração aqui diretamente em um arquivo .ts que não seja .d.ts
// declare global {
//   namespace Express {
//     interface Request {
//       user?: { userId: string; isAdmin: boolean; };
//     }
//   }
// }

const userService = new UserService(); // Instancie o serviço aqui

// Exporte o controller como um objeto com os métodos
export const UserController = {
  async register(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ error: "Nome, email e senha são obrigatórios." });
      }
      const user = await userService.register(name, email, password);
      res.status(201).json(user);
    } catch (e: any) {
      res.status(400).json({ error: e.message || "Erro ao registrar usuário." });
    }
  },

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const data = await userService.login(email, password);
      res.json(data);
    } catch (e: any) {
      res.status(400).json({ error: e.message || "Erro no login. Verifique suas credenciais." });
    }
  },

  async getUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await userService.findById(id);
      if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }
      return res.json(user);
    } catch (err: any) {
      return res.status(500).json({ error: "Erro ao buscar usuário" });
    }
  },

  async getUserProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.userId; // Pega o ID do usuário do token via authMiddleware
      if (!userId) {
        return res.status(401).json({ message: "Usuário não autenticado." });
      }
      const userProfile = await userService.getUserProfile(userId); // Chama o novo método do serviço
      res.status(200).json(userProfile);
    } catch (error: any) {
      console.error("Erro ao obter perfil do usuário:", error);
      res.status(500).json({ error: error.message || "Erro interno do servidor." });
    }
  }
};