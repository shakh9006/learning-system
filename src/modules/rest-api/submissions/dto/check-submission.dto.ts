import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CheckSubmissionDto {
  @ApiProperty({
    example: 1,
    description: 'The ID of the text for which the submission is made',
    type: Number
  })
  @IsNumber()
  textId: number;

  @ApiProperty({
    example: 'This is the text that was submitted by the user during dictation.',
    description: 'The text input provided by the user during the dictation exercise',
    type: String
  })
  @IsString()
  userInput: string;

  @ApiProperty({
    example: 120,
    description: 'Duration of the dictation exercise in seconds',
    type: Number
  })
  @IsNumber()
  duration: number;
}
