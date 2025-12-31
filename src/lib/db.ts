import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Only initialize Prisma if DATABASE_URL is available
// This prevents build-time errors when database is not accessible
const createPrismaClient = () => {
  if (!process.env.DATABASE_URL) {
    console.warn('DATABASE_URL not found, Prisma client not initialized')
    return null
  }

  return new PrismaClient({
    log: ['query'],
  })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

export const db = prisma
export default prisma

if (process.env.NODE_ENV !== 'production' && prisma) {
  globalForPrisma.prisma = prisma
}