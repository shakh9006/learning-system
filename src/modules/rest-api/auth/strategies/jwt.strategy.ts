import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as process from 'process';
import { UsersService } from '../../users/users.service';
import { TokensPayload } from '../../../internal/tokens/types/TokensPayload';
import { TokensService } from '../../../internal/tokens/tokens.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokenService: TokensService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_ACCESS_SECRET,
    });
  }

  async validate(payload: TokensPayload) {
    const user = await this.usersService.findOne(payload.userId);
    if (!user || user?.isBlocked) {
      throw new UnauthorizedException();
    }

    const token = await this.tokenService.findOne(payload.userId);
    if (!token) {
      throw new UnauthorizedException();
    }

    return payload;
  }
}
