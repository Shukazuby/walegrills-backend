import { Controller, Get, Param, Query, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PaginationFilterDTO } from 'src/product/dto/create-product.dto';
import { BaseResponseTypeDTO } from 'src/utils';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

    @Get()
    @ApiOperation({ summary: 'Admin find all users' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Get all users' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input' })
    async findAllusers(
      @Query() filters: PaginationFilterDTO,
    ): Promise<BaseResponseTypeDTO> {
      const result = await this.usersService.findAllUsers(filters);
      return result;
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a user by  Id' })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'user fetched',
    })
    @ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Invalid input data',
    })
    async getAUser(
      @Param('id') id: string,       
    ): Promise<BaseResponseTypeDTO> {
      const result = await this.usersService.getAUser(id);
      return result;
    }
}
