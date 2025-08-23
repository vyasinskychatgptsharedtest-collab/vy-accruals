import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const steps = [
  { name: 'noLogin' },
  { name: 'login' },
  { name: 'updateApartments' },
  { name: 'updateAccounts' },
  { name: 'updateAccruals' },
];

async function main() {
  // Создаем шаги в базе данных
  for (const step of steps) {
    await prisma.step.create({
      data: step,
    });
  }
  console.log('Steps have been seeded');
}

main()
  .catch(e => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
