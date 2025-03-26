import { PartialType } from '@nestjs/swagger';
import { CreateDialogTextDto } from './create-dialog-text.dto';

export class UpdateDialogTextDto extends PartialType(CreateDialogTextDto) {}
