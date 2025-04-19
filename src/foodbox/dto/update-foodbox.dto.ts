import { PartialType } from '@nestjs/swagger';
import { CreateFoodboxDto } from './create-foodbox.dto';

export class UpdateFoodboxDto extends PartialType(CreateFoodboxDto) {}
