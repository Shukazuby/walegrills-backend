import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterAdminDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BaseResponseTypeDTO } from 'src/utils';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register Admin' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Admin Register' })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  async createAdmin(
    @Body() payload: RegisterAdminDto,
  ): Promise<BaseResponseTypeDTO> {
    const result = await this.authService.register(payload);
    return result;
  }

  @Post('login')
  @ApiOperation({ summary: 'Admin login' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Admin login' })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  async login(@Body() payload: LoginDto): Promise<BaseResponseTypeDTO> {
    const result = await this.authService.login(payload);
    return result;
  }
}
