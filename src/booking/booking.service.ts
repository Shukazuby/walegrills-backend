import { HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';
import Stripe from 'stripe';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Booking } from './entities/booking.entity';
import * as dotenv from 'dotenv';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from 'src/product/entities/product.entity';
import { BaseResponseTypeDTO } from 'src/utils';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET, {
  apiVersion: '2025-03-31.basil',
});

const origin = 'SE28 8LL, Thamesmead';

@Injectable()
export class BookingService {
  constructor(
    @InjectModel(Booking.name) private readonly bookingModel: Model<Booking>,
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
    @InjectModel(User.name) private readonly userModel: Model<User>,

    private readonly userSrv: UsersService,
  ) {}

  async calculateDistance(
    destination: string,
  ): Promise<{ distance: number; duration: number }> {
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json`;

    const res = await axios.get(url, {
      params: {
        origins: origin, // make sure 'origin' is defined in your context
        destinations: destination,
        key: process.env.GOOGLE_API_KEY,
      },
    });

    const element = res.data.rows[0].elements[0];

    if (element.status !== 'OK') {
      throw new Error(
        `Could not retrieve distance/duration from Google Maps API`,
      );
    }

    const distanceInMeters = element.distance.value; // meters
    const durationInSeconds = element.duration.value; // seconds

    const distanceInMiles = distanceInMeters / 1609.34;
    const durationInHours = durationInSeconds / 3600;

    return {
      distance: distanceInMiles,
      duration: durationInHours,
    };
  }

  async createBooking(dto: CreateBookingDto): Promise<BaseResponseTypeDTO> {
    try {
      await this.userSrv.createUser(dto);
      const email = dto.email.toLowerCase();
      const distance = await this.calculateDistance(dto.eventVenue);
      const distanceHour = distance.duration;
      const guests = dto.numberOfGuests;
      const serviceTime = dto.serviceTime;

      let chefs = 0;
      let waiters = 0;
      let equipmentCost = 0;
      let chefRate = 0;
      let waiterRate = 0;
      let chargePermile = 0;
      let transportation = 0;
      let driverChargePh = 0;

      // Staff & equipment
      if (guests <= 100) {
        chefs = 1;
        waiters = 2;
        equipmentCost = 50;
      } else if (guests <= 200) {
        chefs = 2;
        waiters = 4;
        equipmentCost = 100;
      } else if (guests <= 300) {
        chefs = 4;
        waiters = 5;
        equipmentCost = 250;
      } else if (guests <= 400) {
        chefs = 4;
        waiters = 6;
        equipmentCost = 300;
      } else if (guests <= 500) {
        chefs = 4;
        waiters = 8;
        equipmentCost = 350;
      }

      // Staff rates
      if (serviceTime <= 5) {
        chefRate = 18.5;
        waiterRate = 12.5;
      } else if (serviceTime <= 10) {
        chefRate = 20;
        waiterRate = 13.5;
      } else if (serviceTime <= 15) {
        chefRate = 22.5;
        waiterRate = 14.5;
      }

      // Driver charge by hour
      if (distanceHour < 1) driverChargePh = 10;
      else if (distanceHour < 2) driverChargePh = 20;
      else if (distanceHour < 3) driverChargePh = 30;
      else if (distanceHour < 4) driverChargePh = 40;

      // Transportation
      if (distance.distance < 10) {
        chargePermile = 1;
      } else if (distance.distance <= 20) {
        chargePermile = 0.9;
      } else {
        chargePermile = 0.8;
      }

      transportation = chargePermile * distance.distance + driverChargePh;

      // Staff cost
      const chefCost = chefs * chefRate * serviceTime;
      const waiterCost = waiters * waiterRate * serviceTime;

      // Fetch product item costs
      let itemsTotal = 0;

      for (const item of dto.itemsNeeded || []) {
        const product = await this.productModel.findById(item.productId).exec();
        if (!product) {
          throw new Error(`Product with ID ${item.productId} not found`);
        }
        itemsTotal += product.amount * item.quantity;
      }

      // Calculate total fee
      let totalFee =
        chefCost + waiterCost + equipmentCost + transportation + itemsTotal;

      if (dto.paymentOption === '40') {
        totalFee = totalFee * 0.4;
      }

      // Stripe checkout
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: [
          {
            price_data: {
              currency: 'gbp',
              product_data: {
                name: 'Event Booking',
              },
              unit_amount: Math.round(totalFee * 100),
            },
            quantity: 1,
          },
        ],
        success_url: 'https://walegrills.com?session_id={CHECKOUT_SESSION_ID}',
        cancel_url: 'https://your-domain.com/cancel',
      });

      // Save to DB
      const booking = new this.bookingModel({
        ...dto,
        email,
        totalFee,
        distance: distance.distance,
        eventDate: new Date(dto.eventDate),
        itemsTotal,
      });

      await booking.save();

      // const email = dto.email.toLowerCase();
      // const user = await this.userModel.findOne({ email });

      // if (user) {
      //   user.numberOfBookings = (user.numberOfBookings || 0) + 1;
      //   await user.save();
      // }

      return {
        data: {
          paymentLink: session.url,
          booking,
          stripePaymentId: session.id,
        },
        success: true,
        code: HttpStatus.CREATED,
        message: 'Booking Initiated',
      };
    } catch (error) {
      console.error('Booking creation failed:', error);
      throw new Error('Failed to create booking');
    }
  }
}
