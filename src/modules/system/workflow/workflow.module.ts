import { Module } from '@nestjs/common';
import { WorkflowService } from './workflow.service';
import { TextToSpeechModule } from '../text-to-speech/text-to-speech.module';
import { ChatGtpModule } from '../chat-gtp/chat-gtp.module';
import { CategoriesModule } from '../../rest-api/categories/categories.module';
import { TextsModule } from '../../rest-api/texts/texts.module';
import { TextProcessingModule } from '../text-processing/text-processing.module';
import { AudioProcessingModule } from '../audio-processing/audio-processing.module';
import { SpeakersModule } from '../../rest-api/speakers/speakers.module';

@Module({
  providers: [WorkflowService],
  imports: [
    TextToSpeechModule,
    ChatGtpModule,
    TextProcessingModule,
    CategoriesModule,
    TextsModule,
    AudioProcessingModule,
    CategoriesModule,
    SpeakersModule,
  ],
  exports: [WorkflowService],
})
export class WorkflowModule {}
