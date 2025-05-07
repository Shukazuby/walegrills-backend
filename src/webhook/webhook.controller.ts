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
  import { Request, Response } from 'express';
  import { BookingService } from 'src/booking/booking.service';
  import { FoodboxService } from 'src/foodbox/foodbox.service';
  import Stripe from 'stripe';
  import * as dotenv from 'dotenv';
import { InjectModel } from '@nestjs/mongoose';
import { Foodbox } from 'src/foodbox/entities/foodbox.entity';
import { Model } from 'mongoose';
import { Booking } from 'src/booking/entities/booking.entity';
  
  dotenv.config();
  
  const stripe = new Stripe(process.env.STRIPE_SECRET, {
    apiVersion: '2025-03-31.basil',
});
  
  @ApiTags('Webhook')
  @Controller('webhook')
  export class WebhookController {
    constructor(
      private readonly bookingService: BookingService,
      private readonly foodboxService: FoodboxService,
      @InjectModel(Foodbox.name) private readonly foodboxModel: Model<Foodbox>,
      @InjectModel(Booking.name) private readonly bookingModel: Model<Booking>,
      
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
          return res.status(400).send('No raw body found');
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
          console.log('✅ Checkout session completed:', session.id);

          const foodbox = await this.foodboxModel.findOne({sessionId: session.id})
          if(foodbox){
            await this.foodboxService.markAsPaidFoodbox(session.id);
          }
  
          const booking = await this.bookingModel.findOne({sessionId: session.id})
          if(booking){
            await this.bookingService.markAsPaidBooking(session.id);
          }
  
          res.status(200).json({ received: true })
          break;
        default:
          console.warn(`Unhandled event type ${event.type}`);
      }
  
      res.json({ received: true });
    }
  }
  