import { Injectable } from '@nestjs/common';
import { Speakers as Speaker, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class SpeakersRepository {
  async findAll(): Promise<Speaker[]> {
    return await prisma.speakers.findMany();
  }
}
