import {
  Controller,
  Post,
  Body,
  Res,
  UnauthorizedException,
  HttpStatus,
  UseGuards,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { RegisterLoginAuthResponseDto } from './dto/register-login-auth-response.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { TokensPayload } from '../../internal/tokens/types/TokensPayload';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'User Registration' })
  @ApiResponse({ status: 201, type: RegisterLoginAuthResponseDto })
  // @UseGuards(LocalAuthGuard)
  async register(
    @Body() data: RegisterAuthDto,
    @Res() res: Response,
  ): Promise<void> {
    const responseData = await this.authService.register(data);
    this.setRefreshTokenToCookies(responseData, res);
  }

  @Post('login')
  @ApiOperation({ summary: 'User Login' })
  @ApiResponse({ status: 201, type: RegisterLoginAuthResponseDto })
  async login(@Body() data: LoginAuthDto, @Res() res: Response): Promise<void> {
    const responseData = await this.authService.login(data);
    this.setRefreshTokenToCookies(responseData, res);
  }

  @Post('refresh-tokens')
  @ApiOperation({ summary: 'Refresh User Tokens' })
  @ApiResponse({ status: 201, type: RegisterLoginAuthResponseDto })
  @UseGuards(JwtRefreshAuthGuard)
  async refreshToken(@CurrentUser() user: TokensPayload, @Res() res: Response) {
    const responseData = await this.authService.refreshTokens(user);
    this.setRefreshTokenToCookies(responseData, res);
  }

  @Post('check-tokens')
  @ApiOperation({ summary: 'Check User Tokens' })
  @ApiResponse({ status: 200, type: RegisterLoginAuthResponseDto })
  @UseGuards(JwtRefreshAuthGuard)
  async checkTokens(@CurrentUser() user: TokensPayload) {
    const hasToken = await this.authService.checkTokens(user);

    return {
      success: true,
      message: 'Token status',
      data: {
        hasToken,
      },
    };
  }

  @Get('logout')
  @UseGuards(JwtRefreshAuthGuard)
  @ApiOperation({ summary: 'Logout' })
  @ApiResponse({ status: 200 })
  async logout(@CurrentUser() user: TokensPayload, @Res() res: Response) {
    const data = await this.authService.logout(user);
    res.cookie('refreshToken', '', {
      httpOnly: true,
      secure: true,
      expires: new Date(),
    });
    res.status(HttpStatus.OK).json({ ...data });
  }

  private setRefreshTokenToCookies(
    data: RegisterLoginAuthResponseDto,
    res: Response,
  ) {
    if (!data.tokens) {
      throw new UnauthorizedException();
    }

    res.cookie('refreshToken', data.tokens.refreshToken, {
      httpOnly: true,
      expires: data.tokens.exp,
      secure: true,
    });

    delete data.tokens.refreshToken;
    res.status(HttpStatus.CREATED).json({ ...data });
  }
}
