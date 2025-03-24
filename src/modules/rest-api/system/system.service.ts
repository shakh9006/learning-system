import { BadRequestException, Injectable } from '@nestjs/common';
import { SystemCreateCategoryDto } from './dto/system-create-category.dto';
import { SystemUpdateCategory } from './dto/system-update-category';
import { CategoriesService } from '../categories/categories.service';
import { TokensPayload } from '../../internal/tokens/types/TokensPayload';
import { CreateCategoryInputDto } from '../categories/dto/create-category-input.dto';
import { UpdateCategoryDto } from '../categories/dto/update-category.dto';
import { WorkflowService } from '../../system/workflow/workflow.service';

@Injectable()
export class SystemService {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly workFlowService: WorkflowService,
  ) {}

  async createCategory(
    user: TokensPayload,
    systemCreateCategoryDto: SystemCreateCategoryDto,
  ): Promise<void> {
    const data: CreateCategoryInputDto = {
      name: systemCreateCategoryDto.name,
      icon: 'random-icon',
    };

    const category = await this.categoriesService.create(user, data);
    await this.workFlowService.generateTextByCategory(category);
  }

  async createStaticCategory(user: TokensPayload): Promise<void> {
    const categories = await this.categoriesService.findSystemCategories();
    const categoryStore = {};

    for (const cat of categories) {
      categoryStore[cat.slug] = cat;
    }

    const staticCategories = this.categoriesService.getStaticCategories();
    for (const name of staticCategories) {
      const slug = this.categoriesService.generateSlugByName(name);
      if (!categoryStore[slug]) {
        const data: CreateCategoryInputDto = {
          name,
          icon: 'random-icon',
          categoryType: 'system',
        };
        categoryStore[slug] = await this.categoriesService.create(user, data);
        console.log(`created new ${categoryStore[slug].name} category`);
      }
    }
  }

  async updateCategory(
    user: TokensPayload,
    id: number,
    systemUpdateCategoryDto: SystemUpdateCategory,
  ): Promise<unknown> {
    const data = {
      name: systemUpdateCategoryDto.name,
    } as UpdateCategoryDto;

    return await this.categoriesService.update(user, id, data);
  }

  async deleteCategory(user: TokensPayload, id: number): Promise<unknown> {
    return await this.categoriesService.remove(user, id);
  }

  async createText(
    user: TokensPayload,
    categoryId: number,
    textCount: number,
  ): Promise<void> {
    const category = await this.categoriesService.findOne(user, categoryId);
    if (!category) {
      throw new BadRequestException(`Category ${categoryId} not found`);
    }

    await this.workFlowService.generateTextByCategory(category, textCount);
  }

  async createTexts(user: TokensPayload): Promise<void> {
    const categories = await this.categoriesService.findSystemCategories();
    const categoryStore = {};

    for (const cat of categories) {
      categoryStore[cat.slug] = cat;
    }

    const staticCategories = this.categoriesService.getStaticCategories();
    for (const name of staticCategories) {
      const iterationStart: number = Date.now();
      const slug = this.categoriesService.generateSlugByName(name);
      if (!categoryStore[slug]) {
        const data: CreateCategoryInputDto = {
          name,
          icon: 'random-icon',
        };
        categoryStore[slug] = await this.categoriesService.create(user, data);
        console.log(`created new ${categoryStore[slug].name} category`);
      }

      const category = categoryStore[slug];
      await this.workFlowService.generateTextByCategory(category);

      const iterationEnd: number = Date.now();
      const elapsedTimeInSeconds: number =
        (iterationEnd - iterationStart) / 1000;

      console.log(`Iteration took ${elapsedTimeInSeconds} seconds`);
      console.log('-------------------------------');
    }
  }
}
