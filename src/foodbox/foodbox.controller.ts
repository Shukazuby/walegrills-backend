import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpStatus,
  Query,
  Patch,
  Delete,
} from '@nestjs/common';
import { FoodboxService } from './foodbox.service';
import { CreateFoodboxDto } from './dto/create-foodbox.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BaseResponseTypeDTO } from 'src/utils';
import { PaginationFilterDTO } from 'src/product/dto/create-product.dto';
import { UpdateBookingDto } from 'src/booking/dto/update-booking.dto';
import { UpdateFoodboxDto } from './dto/update-foodbox.dto';

@ApiTags('Foodbox')
@Controller('foodbox')
export class FoodboxController {
  constructor(private readonly foodboxService: FoodboxService) {}

  @Post()
  @ApiOperation({ summary: 'Create a Foodbox' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Foodbox created',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  async createFoodbox(
    @Body() payload: CreateFoodboxDto,
  ): Promise<BaseResponseTypeDTO> {
    const result = await this.foodboxService.createFoodbox(payload);
    return result;
  }

  @Get('all')
  @ApiOperation({ summary: 'Admin find all foodbox' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Get all foodbox' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input' })
  async findAllFoodBox(
    @Query() filters: PaginationFilterDTO,
  ): Promise<BaseResponseTypeDTO> {
    const result = await this.foodboxService.findAllFoodBox(filters);
    return result;
  }

  @Get()
  @ApiOperation({ summary: 'User find all foodbox' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Get all user foodbox' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input' })
  async findFoodboxByUser(
    @Query() filters: PaginationFilterDTO,
    @Query('email') email?: string,
  ): Promise<BaseResponseTypeDTO> {
    const result = await this.foodboxService.findFoodboxByUser(filters, email);
    return result;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a Foodbox by  Id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Foodbox fetched',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  async getAFoodBox(@Param('id') id: string): Promise<BaseResponseTypeDTO> {
    const result = await this.foodboxService.getAFoodBox(id);
    return result;
  }

  @Patch(':adminId/:id')
  @ApiOperation({ summary: 'Admon update foodbox' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Admin update foodbox' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input' })
  async adminUpdatAFoodbox(
    @Param('adminId') adminId: string,
    @Param('id') id: string,
    @Body() payload: UpdateFoodboxDto,
  ): Promise<BaseResponseTypeDTO> {
    const result = await this.foodboxService.adminUpdatAFoodbox(adminId, id, payload);
    return result;
  }

  @Delete(':adminId/:id')
  @ApiOperation({ summary: ' Delete a Foodbox by  Id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Foodbox deleted',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  async adminDeleAFoodbox(
    @Param('adminId') adminId: string,
    @Param('id') id: string,
  ): Promise<BaseResponseTypeDTO> {
    const result = await this.foodboxService.adminDeleAFoodbox(adminId, id);
    return result;
  }


}
