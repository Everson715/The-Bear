import { PrismaClient } from '@prisma/client'

declare global {
  // evita múltiplas instâncias em dev com hot-reload
  var prisma: PrismaClient | undefined
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ['query'],        // opcional
  })

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma
}
