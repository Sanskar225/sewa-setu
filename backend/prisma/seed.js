// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Create 2 test users
  const userA = await prisma.user.upsert({
    where: { email: 'userA@example.com' },
    update: {},
    create: {
      name: 'User A',
      email: 'userA@example.com',
      phone: '9000000001',
      password: 'hashedpasswordA', // Assume hashed or leave null
    },
  });

  const userB = await prisma.user.upsert({
    where: { email: 'userB@example.com' },
    update: {},
    create: {
      name: 'User B',
      email: 'userB@example.com',
      phone: '9000000002',
      password: 'hashedpasswordB',
    },
  });

  // Create dummy messages between User A and B
  await prisma.message.createMany({
    data: [
      {
        senderId: userA.id,
        receiverId: userB.id,
        content: 'Hey! Is this service available tomorrow?',
      },
      {
        senderId: userB.id,
        receiverId: userA.id,
        content: 'Yes, I’m available from 10 AM to 2 PM.',
      },
      {
        senderId: userA.id,
        receiverId: userB.id,
        content: 'Perfect! Let’s book it.',
      },
    ],
  });

  console.log('✅ Seed complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
