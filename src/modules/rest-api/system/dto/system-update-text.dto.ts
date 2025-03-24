import { PartialType } from '@nestjs/swagger';
import { SystemCreateTextDto } from './system-create-text.dto';

export class SystemUpdateTextDto extends PartialType(SystemCreateTextDto) {}
