import { Injectable } from '@nestjs/common';
import { TokensRepository } from './tokens.repository';
import { JwtService } from '@nestjs/jwt';
import { Tokens } from '@prisma/client';
import { TokensPayload } from './types/TokensPayload';
import * as process from 'process';
import { TokensResult } from './types/TokensResult';
import { UserResponseDto } from '../../rest-api/users/dto/user-response.dto';

@Injectable()
export class TokensService {
  constructor(
    private readonly tokenRepository: TokensRepository,
    private readonly jwtService: JwtService,
  ) {}

  async generateTokens(
    user: UserResponseDto,
    generateRefreshToken = true,
  ): Promise<TokensResult> {
    const tokenPayload: TokensPayload = {
      userId: user.userId,
      email: user.email,
      role: user.role,
    };

    let refreshToken: string;
    const token = await this.tokenRepository.findOne(user.userId);
    if (!generateRefreshToken && token) {
      refreshToken = token.refreshToken;
    } else {
      refreshToken = this.jwtService.sign(tokenPayload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '30d',
      });
    }

    const accessToken = this.jwtService.sign(tokenPayload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '15m',
    });

    return {
      accessToken,
      refreshToken,
      exp: new Date(),
    };
  }

  async saveRefreshToken(userId, refreshToken): Promise<Tokens> {
    return await this.tokenRepository.save(userId, refreshToken);
  }

  async delete(userId: number): Promise<Tokens> {
    return await this.tokenRepository.deleteById(userId);
  }

  async findOne(userId): Promise<Tokens> {
    return await this.tokenRepository.findOne(userId);
  }
}
