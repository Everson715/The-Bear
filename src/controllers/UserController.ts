import { Request, Response } from "express";
import { UserService } from "../services/UserService";

const userService = new UserService();

export class UserController {
  async register(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;
      const user = await userService.register(name, email, password);
      res.status(201).json(user);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const data = await userService.login(email, password);
      res.json(data);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  }

  async getUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await userService.findById(id);
      if (!user) return res.status(404).json({ error: "Usuário não encontrado" });
      return res.json(user);
    } catch (err) {
      return res.status(500).json({ error: "Erro ao buscar usuário" });
    }
  }
}
