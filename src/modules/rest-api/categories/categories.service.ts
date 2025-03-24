import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategoryInputDto } from './dto/create-category-input.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryRepository } from './category.repository';
import { TokensPayload } from '../../internal/tokens/types/TokensPayload';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { CategoryType, Categories as Category } from '@prisma/client';
import { CreateCategoryDto } from './dto/create-category.dto';
import generateSlug from '../../../utils/generateSlug';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoryRepository: CategoryRepository) {}
  async create(
    user: TokensPayload | UserResponseDto,
    createCategoryInputDto: CreateCategoryInputDto,
  ): Promise<Category> {
    const createData = createCategoryInputDto as CreateCategoryDto;
    const categoryType: CategoryType = createData.categoryType || 'system';

    if (categoryType === 'system') {
      createData.isPublic = true;
    }

    createData.categoryType = categoryType;
    createData.slug = this.generateSlugByName(createData.name);

    return await this.categoryRepository.create(user.userId, createData);
  }

  async findAll(user: TokensPayload | UserResponseDto): Promise<Category[]> {
    const result: Category[] = [];
    const systemCategories = await this.categoryRepository.findSystem();
    result.push(...systemCategories);

    const userCategories = await this.categoryRepository.findAll(user.userId);
    result.push(...userCategories);

    return result;
  }

  async findSystemCategories(): Promise<Category[]> {
    return await this.categoryRepository.findAllSystem();
  }

  async findOne(
    user: TokensPayload | UserResponseDto,
    id: number,
    withText: boolean = false,
  ): Promise<Category> {
    const category = await this.categoryRepository.findById(user.userId, id);
    if (!category) {
      throw new BadRequestException('Category not found');
    }

    return await this.categoryRepository.findById(user.userId, id, withText);
  }

  async update(
    user: TokensPayload | UserResponseDto,
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.categoryRepository.findById(user.userId, id);
    if (!category) {
      throw new BadRequestException('Category not found');
    }

    if (updateCategoryDto.hasOwnProperty('name') && !updateCategoryDto.name) {
      throw new BadRequestException('Name must not be empty');
    }

    if (user.role === 'USER' && updateCategoryDto?.categoryType !== 'custom') {
      delete updateCategoryDto.categoryType;
    }

    if (updateCategoryDto?.name) {
      updateCategoryDto.slug = this.generateSlugByName(updateCategoryDto.name);
    }

    return await this.categoryRepository.update(
      user.userId,
      id,
      updateCategoryDto,
    );
  }

  async findBySlug(userId: number, slug: string): Promise<Category> {
    return await this.categoryRepository.findBySlug(userId, slug);
  }

  async remove(
    user: TokensPayload | UserResponseDto,
    id: number,
  ): Promise<Category> {
    const category = await this.categoryRepository.findById(user.userId, id);
    if (!category) {
      throw new BadRequestException('Category already deleted');
    }

    if (user.role === 'USER' && category.categoryType === 'system') {
      throw new BadRequestException('Access denied');
    }

    return await this.categoryRepository.delete(user.userId, id);
  }

  public generateSlugByName(name: string): string {
    return generateSlug(name);
  }

  public getStaticCategories(): string[] {
    return [
      'Travel',
      'Education',
      'Health and Fitness',
      'Technology',
      'Environment and Nature',
      'History and Culture',
      'Work and Business',
      'Entertainment',
      'Relationships and Communication',
      'Hobbies and Lifestyle',
    ];
  }

  async createDefaultCategories(user: TokensPayload | UserResponseDto) {
    await this.create(user, {
      name: 'Vocabulary',
      icon: '',
      categoryType: 'custom',
    });
  }
}
