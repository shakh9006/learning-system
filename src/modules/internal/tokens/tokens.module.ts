import { Module } from '@nestjs/common';
import { TokensService } from './tokens.service';
import { TokensRepository } from './tokens.repository';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [],
  providers: [TokensService, TokensRepository],
  imports: [JwtModule],
  exports: [TokensService],
})
export class TokensModule {}
