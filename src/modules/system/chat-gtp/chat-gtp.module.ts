import { Module } from '@nestjs/common';
import { ChatGtpService } from './chat-gtp.service';

@Module({
  providers: [ChatGtpService],
  exports: [ChatGtpService],
})
export class ChatGtpModule {}
