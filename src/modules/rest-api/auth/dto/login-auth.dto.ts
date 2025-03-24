import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class LoginAuthDto {
  @ApiProperty({ example: 'user@mail.com', description: 'client email' })
  @IsString({ message: 'Must be string' })
  @IsEmail({}, { message: 'Invalid email' })
  email: string;

  @ApiProperty({ example: 'qwerty123', description: 'client password' })
  @IsString({ message: 'Must be string' })
  @Length(4, 20, { message: 'More than 4 and less then 20' })
  password: string;
}
