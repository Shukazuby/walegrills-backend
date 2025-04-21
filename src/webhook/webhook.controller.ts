import {
  Controller,
  Post,
  Headers,
  Req,
  Res,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { BookingService } from 'src/booking/booking.service';
import { FoodboxService } from 'src/foodbox/foodbox.service';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET, {
  apiVersion: '2025-03-31.basil',
});

@ApiTags('Webhook')
@Controller('webhook')
export class WebhookController {
  constructor(
    private readonly bookingService: BookingService,
    private readonly foodboxService: FoodboxService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async handleStripeWebhook(
    @Req() req: Request,
    @Res() res: Response,
    @Headers('stripe-signature') sig: string,
  ) {
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event: Stripe.Event;

    try {
      const rawBody = (req as any).rawBody;
      if (!rawBody) {
        console.error('❌ No raw body found in request');
      }
      event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
    } catch (err) {
      console.error('Webhook signature verification failed.', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('E Reach hereeeeeeeeee');
        await this.bookingService.markAsPaidBooking(session.id);
        await this.foodboxService.markAsPaidFoodbox(session.id);

        console.log('2222222222222 E Reach hereeeeeeeeee');
        break;
      // Add more event types if needed
      default:
        console.warn(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  }
}
