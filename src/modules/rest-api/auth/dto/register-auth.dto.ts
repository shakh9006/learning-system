import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsStrongPassword,
  Length,
} from 'class-validator';
import { Roles } from '@prisma/client';

export class RegisterAuthDto {
  @ApiProperty({ example: 'user@mail.com', description: 'client email' })
  @IsEmail({}, { message: 'Invalid email' })
  @IsString({ message: 'Must be string' })
  email: string;

  @ApiProperty({ example: 'johnDoe123', description: 'client username' })
  @IsString({ message: 'Must be string' })
  username: string;

  @ApiProperty({ example: 'qwerty123', description: 'client password' })
  @IsStrongPassword({ minLength: 4 })
  @Length(4, 20, { message: 'Must be more than 4 and less then 20' })
  @IsString({ message: 'Must be string' })
  password: string;

  @ApiProperty({ example: 'USER', description: 'client role' })
  @IsEnum(Roles)
  @IsOptional()
  role?: Roles;
}
