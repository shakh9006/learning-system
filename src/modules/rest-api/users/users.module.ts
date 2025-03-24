import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { PointsModule } from '../../internal/points/points.module';
import { SettingsModule } from '../settings/settings.module';
import { CategoriesModule } from '../categories/categories.module';
import { VocabularyGroupModule } from '../vocabulary-group/vocabulary-group.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
  imports: [
    PointsModule,
    SettingsModule,
    CategoriesModule,
    VocabularyGroupModule,
  ],
})
export class UsersModule {}
