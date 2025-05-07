import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { UserPrefix } from '../dto/create-booking.dto';

export enum PaymentOptionss {
  FOUTRY = 40,
  HUNDRED = 100,
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export class Items {
  @ApiProperty({
    example: '67fd3438ea2e860ce70d11b8',
    description: 'Product ID',
  })
  @IsString()
  @IsNotEmpty()
  @Prop({ ref: 'Product' })
  productId: string;

  @ApiProperty({ example: 3, description: 'Quantity of the product' })
  @IsNumber()
  @Prop()
  quantity: number;
}

@Schema()
export class Booking {
  @Prop()
  prefix: UserPrefix;

  @Prop()
  name: string;

  @Prop()
  @IsEmail()
  email: string;

  @Prop()
  numberOfGuests: number;

  @Prop()
  eventDate: Date;

  @Prop()
  serviceTime: number;

  @Prop()
  servingTime: string;

  @Prop()
  invoiceNumber?: number;

  @Prop()
  eventStyle?: string;

  @Prop()
  note?: string;

  @Prop()
  phoneNumber: string;

  @Prop()
  eventVenue: string;

  @Prop()
  eventType?: string;

  @Prop()
  sessionId?: string;

  @Prop()
  itemsNeeded: Items[];

  @Prop()
  totalFee: number;

  @Prop()
  balanceDue?: number;

  @Prop()
  amountToPay: number;

  @Prop()
  distance: number;

  @Prop({ ref: 'User' })
  userId: string;

  @Prop()
  cus_Id?: string;

  @Prop({ default: PaymentOptionss.HUNDRED })
  paymentOption: PaymentOptionss;

  @Prop({ default: PaymentStatus.PENDING })
  paymentStatus?: PaymentStatus;

  @Prop({ default: new Date() })
  createdAt: Date;

  @Prop({ default: new Date() })
  updatedAt: Date;
}

export type BookingDocument = Booking & Document;
export const BookingSchema = SchemaFactory.createForClass(Booking);
