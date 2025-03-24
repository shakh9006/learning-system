import { Injectable } from '@nestjs/common';
import { Categories as Category, PrismaClient } from '@prisma/client';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

const prisma = new PrismaClient();

@Injectable()
export class CategoryRepository {
  async create(
    userId: number,
    createData: CreateCategoryDto,
  ): Promise<Category> {
    return await prisma.categories.create({
      data: {
        name: createData.name,
        slug: createData.slug,
        icon: createData.icon,
        ...(createData.isPublic ? { isPublic: true } : { isPublic: false }),
        categoryType:
          createData.categoryType === 'system'
            ? createData.categoryType
            : 'custom',
        user: {
          connect: {
            userId,
          },
        },
      },
    });
  }

  async update(
    userId: number,
    categoryId: number,
    updateData: UpdateCategoryDto,
  ): Promise<Category> {
    return await prisma.categories.update({
      where: {
        categoryId,
        userId,
      },
      data: {
        ...updateData,
      },
    });
  }

  async findAll(userId: number): Promise<Category[]> {
    return await prisma.categories.findMany({
      where: {
        userId,
      },
    });
  }

  async findSystem(): Promise<Category[]> {
    return await prisma.categories.findMany({
      where: {
        categoryType: 'system',
      },
    });
  }

  async findAllSystem(): Promise<Category[]> {
    return await prisma.categories.findMany({
      where: {
        categoryType: 'system',
      },
    });
  }

  async findById(
    userId: number,
    categoryId: number,
    texts: boolean = false,
  ): Promise<Category> {
    return await prisma.categories.findFirst({
      where: {
        categoryId,
        userId,
      },
      include: {
        text: !!texts,
      },
    });
  }

  async delete(userId: number, categoryId: number): Promise<Category> {
    return await prisma.categories.delete({
      where: {
        categoryId,
        userId,
      },
    });
  }

  async findBySlug(userId: number, slug: string): Promise<Category> {
    return await prisma.categories.findFirst({
      where: {
        slug,
        userId,
      },
    });
  }
}
