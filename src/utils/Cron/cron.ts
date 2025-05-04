import { Injectable } from '@nestjs/common';
import * as cron from 'node-cron';
import { confirmBookingEmail } from 'src/Email/comfirmation';

@Injectable()
export class CronWork {
  constructor() {
    this.scheduleJobs();
  }

  private scheduleJobs() {
    // cron.schedule('* * * * *', async () => {
    //   console.log('🚀 Running scheduled job ...');

    //   const bookingPayload = {
    //     balance: 600,
    //     paymentDeadline: '20-07-14',
    //     eventDate: '20-07-17',
    //     deposit: 40,
    //     itemsSelected: [
    //       {
    //         productId: '67fd353c9678acf4462b5d0a',
    //         quantity: 3,
    //       },
    //     ],
    //     subject: `Catering Booking Confirmation - 20-07-17`,
    //     recepient: 'shukazuby@gmail.com',
    //     firstName: 'Zubyyyy',
    //   };
    //   await confirmBookingEmail(bookingPayload);
    //   console.log('created ...');
    // });
  }
}
