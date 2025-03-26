import { PartialType } from '@nestjs/swagger';
import { CreateSpeechTextDto } from './create-speech-text.dto';

export class UpdateSpeechTextDto extends PartialType(CreateSpeechTextDto) {}
