"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../utils/prisma");
const jwtSecret = process.env.JWT_SECRET || "secreta-do-bear";
class UserService {
    async register(name, email, password) {
        const existingUser = await prisma_1.prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            throw new Error("E-mail já cadastrado");
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        return await prisma_1.prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                xp: 0,
                coffeeBeans: 0,
                level: "Urso Curioso"
            }
        });
    }
    async login(email, password) {
        const user = await prisma_1.prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                name: true,
                email: true,
                password: true,
                xp: true,
                coffeeBeans: true,
                level: true
            }
        });
        if (!user) {
            throw new Error("Email ou senha inválidos");
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            throw new Error("Email ou senha inválidos");
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, jwtSecret, { expiresIn: "1d" });
        const { password: _, ...userWithoutPassword } = user;
        return { user: userWithoutPassword, token };
    }
    async findById(id) {
        return await prisma_1.prisma.user.findUnique({
            where: { id },
            include: {
                purchases: true,
                notifications: true
            }
        });
    }
}
exports.UserService = UserService;
