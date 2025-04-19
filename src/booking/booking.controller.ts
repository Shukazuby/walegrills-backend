// booking.controller.ts
import { Controller, Post, Body, Query, Get } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { ApiTags } from '@nestjs/swagger';

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
}
