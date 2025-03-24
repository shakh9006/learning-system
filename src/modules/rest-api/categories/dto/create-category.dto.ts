import { CreateCategoryInputDto } from './create-category-input.dto';

export class CreateCategoryDto extends CreateCategoryInputDto {
  slug: string;
}
