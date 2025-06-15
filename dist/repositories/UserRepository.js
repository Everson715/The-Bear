"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const prisma_1 = require("../lib/prisma");
class UserRepository {
    async create(name, email, hashedPassword) {
        return prisma_1.prisma.user.create({
            data: { name, email, password: hashedPassword }
        });
    }
    async findByEmail(email) {
        return prisma_1.prisma.user.findUnique({ where: { email } });
    }
}
exports.UserRepository = UserRepository;
