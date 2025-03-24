import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateVocabularyInputDto {
  @ApiProperty({ example: 'Hello', description: 'Word which must translate' })
  @IsString({ message: 'Must be string' })
  word: string;

  @ApiProperty({ example: 'Hello', description: 'Word meaning' })
  @IsString({ message: 'Must be string' })
  @IsOptional()
  translation?: string;

  @ApiProperty({ example: 'hello', description: 'Word transcription' })
  @IsString({ message: 'Must be string' })
  @IsOptional()
  transcription?: string;

  @ApiProperty({ example: 'true', description: 'Generate Text By AI' })
  @IsBoolean({ message: 'Must be boolean' })
  @IsOptional()
  generateText?: boolean;
}
