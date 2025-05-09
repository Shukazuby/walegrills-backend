import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserPrefix } from 'src/booking/dto/create-booking.dto';
import { Items, PaymentStatus } from 'src/booking/entities/booking.entity';

@Schema({ timestamps: true })
export class Foodbox {
  @Prop()
  prefix: UserPrefix;

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
  amountPaid?: number;

  @Prop()
  sessionId?: string;

  @Prop()
  itemsSelected: Items[];

  @Prop({ default: PaymentStatus.PENDING })
  paymentStatus: PaymentStatus;

  @Prop({ example: '9000000000' })
  phoneNumber: string;

  @Prop()
  cus_Id?: string;

  @Prop()
  deliveryAddress: string;

  @Prop({ default: new Date() })
  createdAt: Date;

  @Prop({ default: new Date() })
  updatedAt: Date;
}

export type FoodboxDocument = Foodbox & Document;
export const FoodboxSchema = SchemaFactory.createForClass(Foodbox);
