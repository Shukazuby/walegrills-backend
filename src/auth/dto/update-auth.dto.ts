import { PartialType } from '@nestjs/swagger';
import { RegisterAdminDto } from './create-auth.dto';

export class UpdateAuthDto extends PartialType(RegisterAdminDto) {}
