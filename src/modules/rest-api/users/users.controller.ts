import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserResponseDto } from './dto/user-response.dto';
import { Users } from '@prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles as Role } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtRoleGuard } from '../auth/guards/roles.guard';

@Controller('user')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('profile')
  @UseGuards(JwtRoleGuard)
  @Roles(Role.USER, Role.TEST, Role.ADMIN)
  async profile(@CurrentUser() user: Users): Promise<UserResponseDto> {
    return await this.userService.getUser(user.userId);
  }
}
