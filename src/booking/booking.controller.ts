// booking.controller.ts
import {
  Controller,
  Post,
  Body,
  Query,
  Get,
  HttpStatus,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BaseResponseTypeDTO } from 'src/utils';
import { PaginationFilterDTO } from 'src/product/dto/create-product.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@ApiTags('Booking')
@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  @ApiOperation({ summary: 'Create a Booking' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Booking created',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  async createBooking(
    @Body() payload: CreateBookingDto,
  ): Promise<BaseResponseTypeDTO> {
    const result = await this.bookingService.createBooking(payload);
    return result;
  }

  @Post()
  create(@Body() dto: CreateBookingDto) {
    return this.bookingService.createBooking(dto);
  }

  @Get('distance')
  async getDistance(@Query('to') destination: string) {
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
    @Query('email') email?: string,
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
  async getABooking(@Param('id') id: string): Promise<BaseResponseTypeDTO> {
    const result = await this.bookingService.getABooking(id);
    return result;
  }

  @Patch(':adminId/:id')
  @ApiOperation({ summary: 'Admon update booking' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Admin update booking' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input' })
  async adminUpdatABooking(
    @Param('adminId') adminId: string,
    @Param('id') id: string,
    @Body() payload: UpdateBookingDto,
  ): Promise<BaseResponseTypeDTO> {
    const result = await this.bookingService.adminUpdatABooking(
      adminId,
      id,
      payload,
    );
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
  async adminDeleABooking(
    @Param('adminId') adminId: string,
    @Param('id') id: string,
  ): Promise<BaseResponseTypeDTO> {
    const result = await this.bookingService.adminDeleABooking(adminId, id);
    return result;
  }

  @Get(':adminId/booking-bal')
  @ApiOperation({ summary: 'Admin find all bookings with pending balance' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Get all bookings with pending balance' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input' })
  async findBookingsWithPendingBal(
    @Param() adminId: string,
    @Query() filters: PaginationFilterDTO,
  ): Promise<BaseResponseTypeDTO> {
    const result = await this.bookingService.findBookingsWithPendingBal(adminId, filters);
    return result;
  }

}
