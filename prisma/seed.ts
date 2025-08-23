import { PrismaClient } from '@prisma/client';
import { logger } from '../helpers/logger';

const prisma = new PrismaClient();

const steps = [
  { name: 'noLogin' },
  { name: 'login' },
  { name: 'updateApartments' },
  { name: 'updateAccounts' },
  { name: 'updateAccruals' },
];

async function main() {
  try {
    // Создаем шаги в базе данных
    for (const step of steps) {
      await prisma.step.create({
        data: step,
      });
      logger.info(`Created step ${step.name}`);
    }
    logger.info('Steps have been seeded');
  } catch (error) {
    const message = (error as Error).message;
    logger.error(`seed: ${message}`);
    throw error;
  }
}

main()
  .catch(e => {
    logger.error(`seed main: ${e.message}`);
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
    logger.info('Database connection closed');
  });
