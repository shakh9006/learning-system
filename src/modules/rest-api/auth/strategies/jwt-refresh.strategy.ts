import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { AuthService } from '../auth.service';
import * as process from 'process';
import { TokensPayload } from '../../../internal/tokens/types/TokensPayload';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => request.cookies?.refreshToken,
      ]),
      secretOrKey: process.env.JWT_REFRESH_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: TokensPayload) {
    const user = await this.userService.findOne(payload.userId);
    if (!user || user?.isBlocked) {
      throw new UnauthorizedException();
    }

    const isValid = await this.authService.verifyUserRefreshToken(
      request.cookies?.refreshToken,
      payload.userId,
    );

    if (!isValid) {
      throw new UnauthorizedException();
    }

    return payload;
  }
}
