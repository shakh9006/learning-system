import { Injectable } from '@nestjs/common';
import { Tokens, PrismaClient } from '@prisma/client';
import { add } from 'date-fns';

const prisma = new PrismaClient();

@Injectable()
export class TokensRepository {
  async save(userId: number, refreshToken: string): Promise<Tokens> {
    return await prisma.tokens.upsert({
      where: { userId },
      update: {
        refreshToken,
        exp: add(new Date(), { months: 1 }),
      },
      create: {
        refreshToken,
        exp: add(new Date(), { months: 1 }),
        user: {
          connect: {
            userId,
          },
        },
      },
    });
  }

  async findOne(userId: number): Promise<Tokens> {
    return await prisma.tokens.findFirst({
      where: {
        userId,
      },
    });
  }

  async deleteById(id: number): Promise<Tokens> {
    return await prisma.tokens.delete({
      where: {
        userId: id,
      },
    });
  }

  async deleteByToken(token: string): Promise<Tokens> {
    return await prisma.tokens.delete({
      where: {
        refreshToken: token,
      },
    });
  }
}
