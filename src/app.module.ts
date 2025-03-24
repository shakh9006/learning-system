import { Module } from '@nestjs/common';
import { PrismaModule } from './modules/system/prisma/prisma.module';
import { AuthModule } from './modules/rest-api/auth/auth.module';
import { UsersModule } from './modules/rest-api/users/users.module';
import { TokensModule } from './modules/internal/tokens/tokens.module';
import { ConfigModule } from '@nestjs/config';
import { VocabularyModule } from './modules/rest-api/vocabulary/vocabulary.module';
import { PointHistoryModule } from './modules/internal/point-history/point-history.module';
import { CategoriesModule } from './modules/rest-api/categories/categories.module';
import { AudioFilesModule } from './modules/internal/audio-files/audio-files.module';
import { DictationsModule } from './modules/internal/dictations/dictations.module';
import { PerformanceModule } from './modules/internal/performance/performance.module';
import { FileGeneratorModule } from './modules/system/file-generator/file-generator.module';
import { SystemModule } from './modules/rest-api/system/system.module';
import { TextToSpeechModule } from './modules/system/text-to-speech/text-to-speech.module';
import { ChatGtpModule } from './modules/system/chat-gtp/chat-gtp.module';
import { TextProcessingModule } from './modules/system/text-processing/text-processing.module';
import { StorageModule } from './modules/system/storage/storage.module';
import { AudioProcessingModule } from './modules/system/audio-processing/audio-processing.module';
import { WorkflowModule } from './modules/system/workflow/workflow.module';
import { PointsModule } from './modules/internal/points/points.module';
import { SettingsModule } from './modules/rest-api/settings/settings.module';
import { VocabularyGroupModule } from './modules/rest-api/vocabulary-group/vocabulary-group.module';
import { TextsModule } from './modules/rest-api/texts/texts.module';
import { SpeakersModule } from './modules/rest-api/speakers/speakers.module';
import { VocabularyAudioFilesModule } from './modules/internal/vocabulary-audio-files/vocabulary-audio-files.module';
import { SubmissionsModule } from './modules/rest-api/submissions/submissions.module';
import { AchievementsModule } from './modules/internal/achievements/achievements.module';
import { UserAchievementsModule } from './modules/internal/user-achievements/user-achievements.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    TokensModule,
    VocabularyModule,
    PointHistoryModule,
    TextsModule,
    CategoriesModule,
    AudioFilesModule,
    DictationsModule,
    PerformanceModule,
    FileGeneratorModule,
    SystemModule,
    TextToSpeechModule,
    ChatGtpModule,
    TextProcessingModule,
    StorageModule,
    AudioProcessingModule,
    WorkflowModule,
    PointsModule,
    SettingsModule,
    VocabularyGroupModule,
    SpeakersModule,
    VocabularyAudioFilesModule,
    SubmissionsModule,
    AchievementsModule,
    UserAchievementsModule,
  ],
  providers: [],
})
export class AppModule {}
