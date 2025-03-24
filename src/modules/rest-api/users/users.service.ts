import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';
import { UserResponseDto } from './dto/user-response.dto';
import { plainToInstance } from 'class-transformer';
import { Users } from '@prisma/client';
import { PointsService } from '../../internal/points/points.service';
import { SettingsService } from '../settings/settings.service';
import { CategoriesService } from '../categories/categories.service';
import { VocabularyGroupService } from '../vocabulary-group/vocabulary-group.service';

@Injectable()
export class UsersService {
  constructor(
    private userRepository: UsersRepository,
    private readonly pointsService: PointsService,
    private readonly settingsService: SettingsService,
    private readonly categoriesService: CategoriesService,
    private readonly vocabularyGroupService: VocabularyGroupService,
  ) {}
  async create(createUserData: CreateUserDto): Promise<UserResponseDto> {
    const user: Users = await this.userRepository.create(createUserData);
    await this.pointsService.applyPoints(user.userId);
    await this.settingsService.setDefaultSettings(user.userId);
    await this.categoriesService.createDefaultCategories(user);
    await this.vocabularyGroupService.createDefaultGroup(user.userId);

    return this.formatUser(user);
  }

  async getUser(id: number) {
    const user = await this.findOne(id);
    return this.formatUser(user);
  }

  async findOne(idOrEmail: string | number): Promise<Users> {
    return await this.userRepository.findOne(idOrEmail);
  }

  async findByEmailOrUser(emailOrUser: string): Promise<Users> {
    return await this.userRepository.findOneByEmailOrUsername(emailOrUser);
  }

  formatUser(data: Users): UserResponseDto {
    return plainToInstance(UserResponseDto, data);
  }
}
