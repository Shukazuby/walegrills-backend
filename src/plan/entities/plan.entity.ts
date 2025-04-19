import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Plan {
  @Prop()
  name: string;

  @Prop()
  amount: number;

  @Prop()
  description?: string;

  @Prop({ default: new Date() })
  createdAt: Date;

  @Prop({ default: new Date() })
  updatedAt: Date;
}

export type PlanDocument = Plan & Document;
export const PlanSchema = SchemaFactory.createForClass(Plan);
