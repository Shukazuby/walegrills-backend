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

export enum BookingFilter {
  ALL = 'paid',
  BALDUE = 'allBalDue',
  FULPAYMENT = 'allFullyPaid',
  PENDING = 'pending',
}

export class Items {
  @ApiProperty({
    example: '68a981b2854ba2e48b0a2300',
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

@Schema({ timestamps: true })
export class Booking {
  @Prop()
  prefix: UserPrefix;

  @Prop()
  name: string;

  @Prop()
  @IsEmail()
  email: string;

  @Prop()
  serviceCharge: number;
  
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
  dietaryres?: string;

  @Prop()
  cutleries?: string;

  @Prop()
  note?: string;

  @Prop()
  phoneNumber: string;

  @Prop()
  eventVenue: string;

  @Prop()
  eventType?: string;

  @Prop({ default: false })
  isHalfPayment?: boolean;

  @Prop({ default: false })
  isBalanceReminder?: boolean;

  @Prop()
  sessionId?: string;

  @Prop()
  balanceSessionId?: string;

  @Prop()
  balancePaymentLink?: string;

  @Prop()
  itemsNeeded: Items[];

  @Prop()
  cutleryItems?: string;

  @Prop()
  totalFee: number;

  @Prop()
  balanceDue?: number;

  @Prop()
  amountToPay: number;

  @Prop()
  distance: number;

  @Prop()
  chefs: number;

  @Prop()
  waiters: number;
  
  @Prop()
  equipment: number;
  

  @Prop()
  transportation: number;
  

  @Prop({ ref: 'User' })
  userId: string;

  @Prop()
  cus_Id?: string;

  @Prop({ default: PaymentOptionss.HUNDRED })
  paymentOption: PaymentOptionss;

  @Prop({ default: PaymentStatus.PENDING })
  paymentStatus?: PaymentStatus;

  @Prop({ ref: 'Admin' })
  updatedByAdminId: string;

  @Prop()
  updatedBy?: string;

  createdAt: Date;
  updatedAt: Date;
}

export type BookingDocument = Booking & Document;
export const BookingSchema = SchemaFactory.createForClass(Booking);
