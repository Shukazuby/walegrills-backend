// booking.controller.ts
import { Controller, Post, Body, Query, Get, HttpStatus, Param } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BaseResponseTypeDTO } from 'src/utils';
import { PaginationFilterDTO } from 'src/product/dto/create-product.dto';

@ApiTags('Booking')
@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  create(@Body() dto: CreateBookingDto) {
    return this.bookingService.createBooking(dto);
  }

  @Get('distance')
  async getDistance(
    @Query('to') destination: string
  ) {
    const miles = await this.bookingService.calculateDistance(destination);
    return { miles };
  }

    @Get('all')
    @ApiOperation({ summary: 'Admin find all bookings' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Get all bookings' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input' })
    async findAllBookings(
      @Query() filters: PaginationFilterDTO,
    ): Promise<BaseResponseTypeDTO> {
      const result = await this.bookingService.findAllBookings(filters);
      return result;
    }
  
    @Get()
    @ApiOperation({ summary: 'User find all bookings' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Get all user bookings' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input' })
    async findBookingsByUser(
      @Query() filters: PaginationFilterDTO,
      @Query('email') email?: string 
    ): Promise<BaseResponseTypeDTO> {
      const result = await this.bookingService.findBookingsByUser(filters, email);
      return result;
    }
  
  
    @Get(':id')
    @ApiOperation({ summary: 'Get a Booking by  Id' })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'Booking fetched',
    })
    @ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Invalid input data',
    })
    async getABooking(
      @Param('id') id: string,       
    ): Promise<BaseResponseTypeDTO> {
      const result = await this.bookingService.getABooking(id);
      return result;
    }
  
}
