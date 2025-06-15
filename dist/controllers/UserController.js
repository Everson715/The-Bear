"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const UserService_1 = require("../services/UserService");
const userService = new UserService_1.UserService();
class UserController {
    async register(req, res) {
        try {
            const { name, email, password } = req.body;
            const user = await userService.register(name, email, password);
            res.status(201).json(user);
        }
        catch (e) {
            res.status(400).json({ error: e.message });
        }
    }
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const data = await userService.login(email, password);
            res.json(data);
        }
        catch (e) {
            res.status(400).json({ error: e.message });
        }
    }
    async getUser(req, res) {
        try {
            const { id } = req.params;
            const user = await userService.findById(id);
            if (!user)
                return res.status(404).json({ error: "Usuário não encontrado" });
            return res.json(user);
        }
        catch (err) {
            return res.status(500).json({ error: "Erro ao buscar usuário" });
        }
    }
}
exports.UserController = UserController;
