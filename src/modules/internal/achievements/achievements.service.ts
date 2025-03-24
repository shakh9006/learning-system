import { Injectable } from '@nestjs/common';
import { CreateAchievementDto } from './dto/create-achievement.dto';
import { AchievementsRepository } from './achievements.repository';
import { AchievementsType, Achievements as Achievement } from '@prisma/client';
import generateSlug from '../../../utils/generateSlug';
import { UserAchievementsService } from '../user-achievements/user-achievements.service';
import { DictationsService } from '../dictations/dictations.service';
import { PointsService } from '../points/points.service';

@Injectable()
export class AchievementsService {
  constructor(
    private readonly achievementsRepository: AchievementsRepository,
    private readonly userAchievementsService: UserAchievementsService,
    private readonly dictationsService: DictationsService,
    private readonly pointsService: PointsService,
  ) {}

  async createDefaultAchievements() {
    const achievements: CreateAchievementDto[] = this.getDefaultAchievements();

    const storedAchievements = {};
    const achievementsFromDB = await this.achievementsRepository.findAll();

    for (const achievement of achievementsFromDB) {
      if (achievement.name) {
        const slug = generateSlug(achievement.name);
        storedAchievements[slug] = 1;
      }
    }

    for (const achievement of achievements) {
      const slug = generateSlug(achievement.name);
      if (!storedAchievements[slug]) {
        console.log(`Creating ${achievement.name}...`);
        await this.achievementsRepository.create(achievement);
      }
    }

    console.log('Achievements created successfully.');
  }

  async getAll(): Promise<Achievement[]> {
    return await this.achievementsRepository.findAll();
  }

  async checkAchievements(userId: number): Promise<void> {
    const userAchievements: { achievementId: number }[] =
      await this.userAchievementsService.getUsersAchievements(userId);

    const ids = {};
    for (const achievement of userAchievements) {
      ids[achievement.achievementId] = 1;
    }

    let achievements = await this.getAll();
    achievements = achievements.filter(
      (achievement) => !ids[achievement.achievementId],
    );

    const textAchievements = achievements.filter(
      (achievement: Achievement) => achievement.type === AchievementsType.TEXTS,
    );

    const dictationsCount =
      await this.dictationsService.getUserDictationsCount(userId);

    for (const achievement of textAchievements) {
      const name = achievement.name;
      if (
        (name === 'First Text Completed' && dictationsCount == 1) ||
        (name === '5 Texts Completed' && dictationsCount == 5) ||
        (name === '10 Texts Completed' && dictationsCount == 10) ||
        (name === '50 Texts Completed' && dictationsCount == 50) ||
        (name === '100 Texts Completed' && dictationsCount == 100)
      ) {
        await this.userAchievementsService.create(
          userId,
          achievement.achievementId,
        );

        await this.pointsService.applyPoints(userId, {
          newPoints: achievement.points,
          reason: 'achievement',
          message: name,
          achievementId: achievement.achievementId,
        });
      }
    }
  }

  getDefaultAchievements(): CreateAchievementDto[] {
    return [
      {
        name: 'First Text Completed',
        description: 'Submitted your first text.',
        points: 2,
        type: AchievementsType.TEXTS,
      },
      {
        name: '5 Texts Completed',
        description: 'Submitted 5 texts.',
        points: 5,
        type: AchievementsType.TEXTS,
      },
      {
        name: '10 Texts Completed',
        description: 'Submitted 10 texts.',
        points: 10,
        type: AchievementsType.TEXTS,
      },
      {
        name: '50 Texts Completed',
        description: 'Submitted 50 texts.',
        points: 20,
        type: AchievementsType.TEXTS,
      },
      {
        name: '100 Texts Completed',
        description: 'Submitted 100 texts.',
        points: 50,
        type: AchievementsType.TEXTS,
      },
      {
        name: '1-Day Streak',
        description: 'Used the app for 1 consecutive day.',
        points: 1,
        type: AchievementsType.STREAK,
      },
      {
        name: '3-Day Streak',
        description: 'Used the app for 3 consecutive days.',
        points: 3,
        type: AchievementsType.STREAK,
      },
      {
        name: '7-Day Streak',
        description: 'Used the app for 7 consecutive days.',
        points: 10,
        type: AchievementsType.STREAK,
      },
      {
        name: '30-Day Streak',
        description: 'Used the app for 30 consecutive days.',
        points: 50,
        type: AchievementsType.STREAK,
      },
      {
        name: '100-Day Streak',
        description: 'Used the app for 100 consecutive days.',
        points: 100,
        type: AchievementsType.STREAK,
      },
      {
        name: 'First Vocabulary Challenge Completed',
        description: 'Completed your first vocabulary challenge.',
        points: 5,
        type: AchievementsType.VOCABULARY,
      },
      {
        name: '5 Vocabulary Challenges Completed',
        description: 'Completed 5 vocabulary challenges.',
        points: 12,
        type: AchievementsType.VOCABULARY,
      },
      {
        name: '10 Vocabulary Challenges Completed',
        description: 'Completed 10 vocabulary challenges.',
        points: 25,
        type: AchievementsType.VOCABULARY,
      },
      {
        name: '50 Vocabulary Challenges Completed',
        description: 'Completed 50 vocabulary challenges.',
        points: 60,
        type: AchievementsType.VOCABULARY,
      },
      {
        name: '100 Vocabulary Challenges Completed',
        description: 'Completed 100 vocabulary challenges.',
        points: 120,
        type: AchievementsType.VOCABULARY,
      },

      {
        name: 'Ranked in Top 10',
        description: 'Entered the top 10 in the leaderboard.',
        points: 15,
        type: AchievementsType.LEADERBOARD,
      },
      {
        name: 'Ranked in Top 5',
        description: 'Entered the top 5 in the leaderboard.',
        points: 30,
        type: AchievementsType.LEADERBOARD,
      },
      {
        name: 'Ranked #1',
        description: 'Reached the #1 position in the leaderboard.',
        points: 100,
        type: AchievementsType.LEADERBOARD,
      },
    ];
  }
}
