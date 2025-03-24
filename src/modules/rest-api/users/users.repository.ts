import { Injectable } from '@nestjs/common';
import { Users as User, PrismaClient } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';

const prisma = new PrismaClient();

@Injectable()
export class UsersRepository {
  async create(user: CreateUserDto): Promise<User> {
    return await prisma.users.create({
      data: {
        ...user,
      },
    });
  }

  async update(userId: number, user: Partial<User>): Promise<User> {
    return await prisma.users.update({
      where: {
        userId: userId,
      },
      data: {
        ...user,
      },
    });
  }

  async delete(id: number): Promise<User> {
    return await prisma.users.delete({
      where: {
        userId: id,
      },
    });
  }

  async findOne(idOrEmail: string | number): Promise<User> {
    return await prisma.users.findFirst({
      where: {
        OR: [{ userId: +idOrEmail }, { email: idOrEmail.toString() }],
      },
    });
  }

  async findOneByEmailOrUsername(usernameOrEmail: string): Promise<User> {
    return await prisma.users.findFirst({
      where: {
        OR: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
      },
    });
  }
}
