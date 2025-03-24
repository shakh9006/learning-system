import { Injectable } from '@nestjs/common';
import { PrismaClient, PointsHistory } from '@prisma/client';
import { CreatePointsDto } from './dto/create-points.dto';

const prisma = new PrismaClient();

@Injectable()
export class PointsRepository {
  async applyUserPoints(userId: number, pointsData?: CreatePointsDto) {
    return prisma.$transaction(async (tx) => {
      let userPoints = await tx.points.findUnique({
        where: { userId },
      });

      if (!userPoints) {
        userPoints = await tx.points.create({
          data: {
            points: 0,
            user: {
              connect: {
                userId: userId,
              },
            },
          },
        });
      }

      let pointsDifference = 0;
      if (pointsData) {
        const { newPoints, reason, message, textId, achievementId } =
          pointsData;

        pointsDifference = newPoints;
        const existingHistory: PointsHistory = await tx.pointsHistory.findFirst(
          {
            where: {
              userId,
              reason,
              textId,
              achievementId,
            },
          },
        );

        if (existingHistory) {
          pointsDifference = newPoints - existingHistory.point;

          await tx.pointsHistory.update({
            where: { pointHistoryId: existingHistory.pointHistoryId },
            data: {
              point: newPoints,
              message,
              updatedAt: new Date(),
            },
          });
        } else {
          await tx.pointsHistory.create({
            data: {
              point: newPoints,
              reason,
              message,
              textId,
              achievementId,
              points: {
                connect: {
                  pointsId: userPoints.pointsId,
                },
              },
              user: {
                connect: {
                  userId,
                },
              },
            },
          });
        }
      }

      await tx.points.update({
        where: { userId },
        data: { points: userPoints.points + pointsDifference },
      });

      return {
        success: true,
        updatedPoints: userPoints.points + pointsDifference,
      };
    });
  }
}
