// src/controllers/UserController.ts
import { Request, Response } from "express";
import { UserService } from "../services/UserService"; // Verifique se o caminho para UserService.ts está correto

const userService = new UserService(); // Instancia o UserService

export class UserController {
  async register(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;
      // LOG DE DEPURACAO: Verifique o que está sendo recebido
      console.log("UserController.register: Recebido corpo da requisição:", { name, email, password });

      // Validação básica
      if (!name || !email || !password) {
        console.log("UserController.register: Erro - Nome, Email ou Senha faltando.");
        return res.status(400).json({ error: "Nome, email e senha são obrigatórios." });
      }

      // Chama o serviço para registrar o usuário
      const user = await userService.register(name, email, password);
      // LOG DE DEPURACAO: Verifique o que o serviço retornou
      console.log("UserController.register: Usuário registrado com sucesso:", user);

      // Responde com sucesso
      res.status(201).json(user); // Status 201 para "Created"

    } catch (e: any) {
      // LOG DE DEPURACAO: Captura e loga qualquer erro durante o registro
      console.error("UserController.register: Erro durante o processo de registro:", e.message);
      // Responde com erro
      // Erros comuns aqui: email já existe, senha muito curta (se validado no serviço)
      res.status(400).json({ error: e.message || "Erro ao registrar usuário." });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      // LOG DE DEPURACAO: Verifique o que está sendo recebido
      console.log("UserController.login: Recebido corpo da requisição:", { email, password });

      const data = await userService.login(email, password);
      // LOG DE DEPURACAO: Verifique o que o serviço de login retornou (user + token)
      console.log("UserController.login: Login bem-sucedido. Dados:", data);

      res.json(data); // Retorna os dados do usuário e token

    } catch (e: any) {
      // LOG DE DEPURACAO: Captura e loga qualquer erro durante o login
      console.error("UserController.login: Erro durante o processo de login:", e.message);
      // Erros comuns aqui: credenciais inválidas
      res.status(400).json({ error: e.message || "Erro no login. Verifique suas credenciais." });
    }
  }

  async getUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      console.log("UserController.getUser: Buscando usuário com ID:", id); // LOG DE DEPURACAO
      const user = await userService.findById(id);
      if (!user) {
        console.log("UserController.getUser: Usuário não encontrado com ID:", id); // LOG DE DEPURACAO
        return res.status(404).json({ error: "Usuário não encontrado" });
      }
      console.log("UserController.getUser: Usuário encontrado:", user); // LOG DE DEPURACAO
      return res.json(user);
    } catch (err: any) {
      console.error("UserController.getUser: Erro ao buscar usuário:", err.message); // LOG DE DEPURACAO
      return res.status(500).json({ error: "Erro ao buscar usuário" });
    }
  }
}