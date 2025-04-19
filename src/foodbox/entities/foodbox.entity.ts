import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Items } from 'src/booking/entities/booking.entity';
export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
}

@Schema()
export class Foodbox {
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  deliveryDate: Date;

  @Prop({ ref: 'Plan' })
  planId: string;

  @Prop()
  imageurl?: string;

  @Prop()
  sessionId?: string;

  @Prop()
  itemsSelected: Items[];

  @Prop({ default: PaymentStatus.PENDING })
  paymentStatus: PaymentStatus;

  @Prop({ example: '9000000000' })
  phoneNumber: string;

  @Prop()
  deliveryAddress: string;

  @Prop({ default: new Date() })
  createdAt: Date;

  @Prop({ default: new Date() })
  updatedAt: Date;
}

export type FoodboxDocument = Foodbox & Document;
export const FoodboxSchema = SchemaFactory.createForClass(Foodbox);
