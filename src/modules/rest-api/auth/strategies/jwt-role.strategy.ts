import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Roles } from '@prisma/client';
import * as process from 'process';
import { UsersService } from '../../users/users.service';
import { TokensService } from '../../../internal/tokens/tokens.service';
import { TokensPayload } from '../../../internal/tokens/types/TokensPayload';

@Injectable()
export class JwtRoleStrategy extends PassportStrategy(Strategy, 'jwt-role') {
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
    if (!user || user?.isBlocked || !user.role) {
      throw new UnauthorizedException();
    }

    const token = await this.tokenService.findOne(payload.userId);
    if (!token) {
      throw new UnauthorizedException();
    }

    if (!Object.values(Roles).includes(user.role)) {
      throw new ForbiddenException('Invalid role');
    }

    return payload;
  }
}
