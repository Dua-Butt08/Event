import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

// Check if we're in a build environment where DATABASE_URL might not be available
const isDuringBuild = process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL;

/**
 * Optimized Prisma client configuration
 * - Connection pooling for better performance
 * - Query logging in development
 * - Error and warn logging always enabled
 * - Singleton pattern to prevent multiple instances
 * - Graceful handling of missing DATABASE_URL during build
 */
export const prisma: PrismaClient =
  globalForPrisma.prisma ?? 
  new PrismaClient({ 
    log: process.env.NODE_ENV === 'development' 
      ? ['query', 'warn', 'error'] 
      : ['warn', 'error'],
    // Connection configuration for better reliability
    datasources: {
      db: {
        url: isDuringBuild 
          ? 'postgresql://localhost:5432/fallback' 
          : process.env.DATABASE_URL!,
      },
    },
  });

// Prevent multiple instances in development (hot reloading)
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Graceful shutdown
if (process.env.NODE_ENV === 'production') {
  process.on('beforeExit', async () => {
    await prisma.$disconnect();
  });
}
