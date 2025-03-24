import { CreatePerformanceDto } from './create-performance.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdatePerformanceDto extends PartialType(CreatePerformanceDto) {}
