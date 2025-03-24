import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { SystemService } from './system.service';
import { SystemCreateCategoryDto } from './dto/system-create-category.dto';
import { SystemUpdateCategory } from './dto/system-update-category';
import { JwtRoleGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Roles as Role } from '@prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { TokensPayload } from '../../internal/tokens/types/TokensPayload';
import { AchievementsService } from '../../internal/achievements/achievements.service';

@Controller('system')
export class SystemController {
  constructor(
    private readonly systemService: SystemService,
    private readonly achievementsService: AchievementsService,
  ) {}

  @Post('/create-achievements')
  @UseGuards(JwtRoleGuard)
  @Roles(Role.ADMIN)
  async createAchievements() {
    await this.achievementsService.createDefaultAchievements();
    return {
      success: true,
      message: 'Achievements created successfully.',
    };
  }

  @Post('/check-achievements')
  @UseGuards(JwtRoleGuard)
  @Roles(Role.ADMIN)
  async checkAchievements(@CurrentUser() user: TokensPayload) {
    await this.achievementsService.checkAchievements(user.userId);
    return {
      success: true,
      message: 'Achievements created successfully.',
    };
  }

  @Post('/create-category')
  @UseGuards(JwtRoleGuard)
  @Roles(Role.ADMIN)
  async createCategories(
    @CurrentUser() user: TokensPayload,
    @Body() createSystemCategoryDto: SystemCreateCategoryDto,
  ) {
    await this.systemService.createCategory(user, createSystemCategoryDto);
    return {
      success: true,
      message: 'Categories created successfully.',
    };
  }

  @Post('/create-static-category')
  @UseGuards(JwtRoleGuard)
  @Roles(Role.ADMIN)
  async createStaticCategories(@CurrentUser() user: TokensPayload) {
    await this.systemService.createStaticCategory(user);
    return {
      success: true,
      message: 'Static categories created successfully.',
    };
  }

  @Post('/create-texts')
  @UseGuards(JwtRoleGuard)
  @Roles(Role.ADMIN)
  async createTexts(@CurrentUser() user: TokensPayload) {
    await this.systemService.createTexts(user);
    return {
      success: true,
      message: 'Texts created successfully.',
    };
  }

  @Post('/create-text')
  @UseGuards(JwtRoleGuard)
  @Roles(Role.ADMIN)
  async createText(
    @CurrentUser() user: TokensPayload,
    @Body() createSingleText: { categoryId: number; count: number },
  ) {
    const data = await this.systemService.createText(
      user,
      createSingleText.categoryId,
      createSingleText.count,
    );

    return {
      success: true,
      message: 'Texts created successfully.',
      data: data,
    };
  }

  @Patch('/update-category/:id')
  @UseGuards(JwtRoleGuard)
  @Roles(Role.ADMIN)
  updateCategories(
    @CurrentUser() user: TokensPayload,
    @Param('id') id: number,
    @Body() updateSystemDto: SystemUpdateCategory,
  ) {
    return this.systemService.updateCategory(user, +id, updateSystemDto);
  }

  @Delete('/delete-category/:id')
  @UseGuards(JwtRoleGuard)
  @Roles(Role.ADMIN)
  deleteCategories(
    @CurrentUser() user: TokensPayload,
    @Param('id') id: number,
  ) {
    return this.systemService.deleteCategory(user, +id);
  }
}
