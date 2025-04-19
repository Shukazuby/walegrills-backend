import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export enum PaymentOptionss {
  FOUTRY = '40',
  HUNDRED = '100',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'pain',
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
  prefix: string;

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
  invoiceNumber?: number;

  @Prop()
  eventStyle?: string;

  @Prop()
  phoneNumber: string;

  @Prop()
  eventVenue: string;

  @Prop()
  eventType?: string;

  @Prop()
  itemsNeeded: Items[];

  @Prop()
  totalFee: number;

  @Prop()
  distance: number;

  @Prop({ ref: 'User' })
  userId: string;


  @Prop({ default: PaymentOptionss.HUNDRED })
  paymentOption: PaymentOptionss;

  @Prop({ default: PaymentStatus.PENDING })
  paymentstatus?: PaymentStatus;

  @Prop({ default: new Date() })
  createdAt: Date;

  @Prop({ default: new Date() })
  updatedAt: Date;
}

export type BookingDocument = Booking & Document;
export const BookingSchema = SchemaFactory.createForClass(Booking);
