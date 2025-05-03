import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Admin {
  @Prop()
  firstName: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop({default: new Date()})
  lastLogged: Date
}
export type AdminDocument = Admin & Document;
export const AdminSchema = SchemaFactory.createForClass(Admin);
