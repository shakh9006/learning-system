import { Roles } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class UserResponseDto {
  @ApiProperty({ example: 1 })
  userId: number;

  @ApiProperty({ example: 'user@mail.com' })
  email: string;

  @ApiProperty({ example: 'johnDoe123' })
  username: string;

  @ApiProperty({ example: 'false' })
  hasPremium: boolean;

  @ApiProperty({ example: 'false' })
  isBlocked: boolean;

  @ApiProperty({ example: 'USER' })
  role: Roles;

  @Exclude()
  password: string;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}
