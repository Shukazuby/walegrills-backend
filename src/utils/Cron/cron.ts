import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import * as cron from 'node-cron';
import { BookingService } from 'src/booking/booking.service';
import { Booking } from 'src/booking/entities/booking.entity';

@Injectable()
export class CronWork {
  constructor(private readonly bookSrv: BookingService) {
    this.scheduleJobs();
  }

  private scheduleJobs() {
    cron.schedule('* * * * *', async () => {
      // console.log('🚀 Running scheduled job ...');
      await this.bookSrv.BalanceReminder();
      // console.log('created ...');
    });
  }
}
