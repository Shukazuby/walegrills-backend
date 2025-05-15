import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export enum ProductTypes {
  GENERAL = 'general',
  MEALPREP = 'mealprep',
}

@Schema({ timestamps: true })
export class Product {
  @Prop()
  name: string;

  @Prop()
  amount: number;

  @Prop()
  description?: string;

  @Prop()
  category?: string;

  @Prop()
  imageurl?: string;

  @Prop({default: ProductTypes.GENERAL})
  productType?: ProductTypes;
  
  createdAt: Date;
  updatedAt: Date;
}

export type ProductDocument = Product & Document;
export const ProductSchema = SchemaFactory.createForClass(Product);
