import { PartialType } from '@nestjs/swagger';
import { CreateDictationTextDto } from './create-dictation-text.dto';

export class UpdateDictationTextDto extends PartialType(
  CreateDictationTextDto,
) {}
