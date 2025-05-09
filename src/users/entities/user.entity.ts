import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail } from 'class-validator';

@Schema({ timestamps: true })
export class User {
  @Prop()
  prefix: string;

  @Prop()
  name: string;
  
  @Prop()
  @IsEmail()
  email: string;

  @Prop()
  phoneNumber: string;

  @Prop()
  numberOfBookings?: number;

  @Prop()
  numberOfMealPrep?: number;

  @Prop()
  status?: string;

  @Prop({ default: new Date() })
  createdAt: Date;

  @Prop({ default: new Date() })
  updatedAt: Date;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
