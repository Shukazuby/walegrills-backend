import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CronWork } from './cron';
import { Booking, BookingSchema } from 'src/booking/entities/booking.entity';
import { BookingModule } from 'src/booking/booking.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }]),
    forwardRef(() => BookingModule),
  ],
  providers: [CronWork],
  exports: [CronWork],
})
export class CronWorkModule {}
