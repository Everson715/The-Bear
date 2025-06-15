import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserRepository } from "../repositories/UserRepository";

const userRepo = new UserRepository();

export class UserService {
  async register(name: string, email: string, password: string) {
    const existing = await userRepo.findByEmail(email);
    if (existing) throw new Error("Usuário já existe");

    const hashedPassword = await bcrypt.hash(password, 10);
    return userRepo.create(name, email, hashedPassword);
  }

  async login(email: string, password: string) {
    const user = await userRepo.findByEmail(email);
    if (!user) throw new Error("Usuário não encontrado");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error("Senha inválida");

    const token = jwt.sign({ id: user.id }, "secreta-do-bear", { expiresIn: "1d" });
    return { token, user: { id: user.id, name: user.name, email: user.email } };
  }
}
