import {
  PrismaClient,
  Users as User,
  Roles,
  SettingsOptions,
} from '@prisma/client';

import { passwordHash } from '../src/utils/password';

const prisma = new PrismaClient();

async function main() {
  const speakers = await prisma.speakers.findMany();
  if (speakers?.length == 0) {
    const staticSpeakers = [
      { name: 'Henry', speakerCode: 'en-US-Studio-Q' },
      { name: 'Jennifer', speakerCode: 'en-US-Studio-O' },
    ];

    for (const speakerData of staticSpeakers) {
      await prisma.speakers.create({
        data: speakerData,
      });

      console.log('Speaker created successfully.');
    }
  }

  // Seed Users
  const admin: User = await prisma.users.findFirst({
    where: {
      userId: 1,
    },
  });

  const data = {
    username: 'admin',
    email: 'super.admin@gmail.com',
    password: await passwordHash('$uper@admin111'),
    hasPremium: true,
    role: Roles.ADMIN,
  };

  if (admin && admin.role !== 'ADMIN') {
    await prisma.users.update({
      where: {
        userId: 1,
      },
      data: data,
    });
  } else if (!admin) {
    const createdUser = await prisma.users.create({
      data: data,
    });
    console.log('Admin created successfully.');

    // Create default General Vocabulary group
    const generalVocabularyGroup = await prisma.vocabularyGroup.findFirst({
      where: {
        userId: createdUser.userId,
        slug: 'general',
      },
    });

    if (!generalVocabularyGroup) {
      await prisma.vocabularyGroup.create({
        data: {
          name: 'General',
          slug: 'general',
          user: {
            connect: {
              userId: createdUser.userId,
            },
          },
        },
      });

      console.log('Created default General Vocabulary group.');
    }

    // Create default Vocabulary category
    const generalCategory = await prisma.categories.findFirst({
      where: {
        userId: createdUser.userId,
        slug: 'vocabulary',
        categoryType: 'custom',
      },
    });

    if (!generalCategory) {
      await prisma.categories.create({
        data: {
          name: 'Vocabulary',
          slug: 'vocabulary',
          categoryType: 'custom',
          icon: '',
          user: {
            connect: {
              userId: createdUser.userId,
            },
          },
        },
      });

      console.log('Created default Vocabulary category.');
    }

    // Creating Point History
    await prisma.points.create({
      data: {
        userId: createdUser.userId,
      },
    });

    // Set Default settings for new user
    const settingsOptions = {
      speakerId: 'en-US-Studio-Q',
      askAddNewWord: 'yes',
    };

    for (const key in settingsOptions) {
      const optionName = key as SettingsOptions;
      await prisma.settings.create({
        data: {
          optionName,
          optionValue: settingsOptions[key],
          user: {
            connect: {
              userId: createdUser.userId,
            },
          },
        },
      });
    }
  }

  console.log('Seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
