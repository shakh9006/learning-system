import { Roles } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsStrongPassword,
  Length,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'user@mail.com', description: 'client email' })
  @IsString({ message: 'Must be string' })
  @IsEmail({}, { message: 'Invalid email' })
  email: string;

  @ApiProperty({ example: 'johnDoe123', description: 'client username' })
  @IsString({ message: 'Must be string' })
  username: string;

  @ApiProperty({ example: 'qwerty123', description: 'client password' })
  @IsString({ message: 'Must be string' })
  @IsStrongPassword()
  @Length(4, 20, { message: 'More than 4 and less then 20' })
  password: string;

  @ApiProperty({ example: 'USER', description: 'client role' })
  @IsEnum(Roles)
  @IsOptional()
  role?: Roles;
}
