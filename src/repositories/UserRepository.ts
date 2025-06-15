import { prisma } from '../lib/prisma';

export class UserRepository {
  async create(name: string, email: string, hashedPassword: string) {
    return prisma.user.create({
      data: { name, email, password: hashedPassword }
    });
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }
}
