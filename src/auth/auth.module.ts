import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from './entities/auth.entity';
import { Product, ProductSchema } from 'src/product/entities/product.entity';
import { ProductModule } from 'src/product/product.module';
import { Booking, BookingSchema } from 'src/booking/entities/booking.entity';
import { BookingModule } from 'src/booking/booking.module';
import { Foodbox, FoodboxSchema } from 'src/foodbox/entities/foodbox.entity';
import { FoodboxModule } from 'src/foodbox/foodbox.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]),
    MongooseModule.forFeature([{ name: Foodbox.name, schema: FoodboxSchema }]),
    forwardRef(() => FoodboxModule),
    MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }]),
    forwardRef(() => BookingModule),
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    forwardRef(() => ProductModule),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
