import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { UsersService } from '../users/users.service';
import { passwordCompare, passwordHash } from '../../../utils/password';
import { Tokens, Users } from '@prisma/client';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { TokensService } from '../../internal/tokens/tokens.service';
import { RegisterLoginAuthResponseDto } from './dto/register-login-auth-response.dto';
import { TokensPayload } from '../../internal/tokens/types/TokensPayload';
import { TokensResult } from '../../internal/tokens/types/TokensResult';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly tokenService: TokensService,
  ) {}

  async register(data: RegisterAuthDto): Promise<RegisterLoginAuthResponseDto> {
    const { email, username, password, role } = data;
    const candidateByEmail = await this.userService.findByEmailOrUser(email);
    if (candidateByEmail) {
      throw new HttpException('Email already exists', 400);
    }

    const candidateByUser = await this.userService.findByEmailOrUser(username);
    if (candidateByUser) {
      throw new HttpException('Username already exists', 400);
    }

    const hashedPassword = await passwordHash(password);
    const createData: CreateUserDto = {
      email,
      username,
      password: hashedPassword,
    };

    if (role) {
      createData.role = role;
    }

    const user: UserResponseDto = await this.userService.create(createData);
    return await this.userTokenActions(user);
  }

  async login(data: LoginAuthDto): Promise<RegisterLoginAuthResponseDto> {
    const { email, password } = data;
    const candidate: Users = await this.userService.findByEmailOrUser(email);
    if (!candidate) {
      throw new HttpException('Wrong email or password', 400);
    }

    const passwordCompareResult = await passwordCompare(
      password,
      candidate.password,
    );

    if (!passwordCompareResult) {
      throw new HttpException('Wrong email or password', 400);
    }

    const user = this.userService.formatUser(candidate);
    return await this.userTokenActions(user, false);
  }

  async refreshTokens(
    user: TokensPayload,
  ): Promise<RegisterLoginAuthResponseDto> {
    const token: Tokens = await this.tokenService.delete(user.userId);
    if (!token || new Date(token.exp) < new Date()) {
      throw new UnauthorizedException();
    }

    const userFromDB = await this.userService.findOne(user.userId);
    const formattedData = this.userService.formatUser(userFromDB);
    return this.userTokenActions(formattedData);
  }

  async checkTokens(user: TokensPayload): Promise<boolean> {
    const token: Tokens = await this.tokenService.findOne(user.userId);
    return !!token;
  }

  async verifyUser(email: string, password: string): Promise<Users | never> {
    try {
      const user: Users = await this.userService.findOne(email);
      if (!user) {
        throw new UnauthorizedException();
      }

      const passwordCompareResult = passwordCompare(password, user.password);
      if (!passwordCompareResult) {
        throw new UnauthorizedException();
      }

      return user;
    } catch (err) {
      throw new UnauthorizedException('Credentials are not valid.');
    }
  }

  async verifyUserRefreshToken(
    refreshToken: string,
    userId: number,
  ): Promise<boolean> {
    try {
      const token: Tokens = await this.tokenService.findOne(userId);
      const authenticated = refreshToken === token.refreshToken;
      if (!authenticated) {
        throw new UnauthorizedException();
      }
      return true;
    } catch (err) {
      throw new UnauthorizedException('Refresh token is not valid.');
    }
  }

  async logout(payload: TokensPayload) {
    const token = await this.tokenService.findOne(payload.userId);
    if (!token) {
      throw new UnauthorizedException();
    }

    await this.tokenService.delete(payload.userId);
    return { message: 'Logout successfully' };
  }

  private async userTokenActions(
    user: UserResponseDto,
    generateRefreshToken: boolean = true,
  ): Promise<RegisterLoginAuthResponseDto> {
    const tokens: TokensResult = await this.tokenService.generateTokens(
      user,
      generateRefreshToken,
    );

    const token = await this.tokenService.saveRefreshToken(
      user.userId,
      tokens.refreshToken,
    );
    tokens.exp = token.exp;

    return {
      user,
      tokens,
    };
  }
}
