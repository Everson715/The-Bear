"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = isAdmin;
const prisma_1 = require("../utils/prisma");
async function isAdmin(req, res, next) {
    const userId = req.headers["x-user-id"];
    if (!userId)
        return res.status(401).json({ error: "ID do usuário não fornecido" });
    const user = await prisma_1.prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.level !== "admin") {
        return res.status(403).json({ error: "Acesso negado. Apenas administradores." });
    }
    next();
}
