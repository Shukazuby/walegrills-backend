import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from 'src/product/entities/product.entity';
import { ProductModule } from 'src/product/product.module';
import { Booking, BookingSchema } from 'src/booking/entities/booking.entity';
import { BookingModule } from 'src/booking/booking.module';
import { Foodbox, FoodboxSchema } from 'src/foodbox/entities/foodbox.entity';
import { FoodboxModule } from 'src/foodbox/foodbox.module';
import { WebhookController } from './webhook.controller';
import { FoodboxService } from 'src/foodbox/foodbox.service';
import { BookingService } from 'src/booking/booking.service';
import { Plan, PlanSchema } from 'src/plan/entities/plan.entity';
import { PlanModule } from 'src/plan/plan.module';
import { Admin, AdminSchema } from 'src/auth/entities/auth.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UsersService } from 'src/users/users.service';
import { User, UserSchema } from 'src/users/entities/user.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Foodbox.name, schema: FoodboxSchema }]),
    forwardRef(() => FoodboxModule),
    MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }]),
    forwardRef(() => BookingModule),
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    forwardRef(() => ProductModule),
    MongooseModule.forFeature([{ name: Plan.name, schema: PlanSchema }]),
    forwardRef(() => PlanModule),
    MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]),
    forwardRef(() => AuthModule),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    forwardRef(() => UsersModule),
  ],
  controllers: [WebhookController],
  providers: [FoodboxService, BookingService, UsersService],
})
export class WebhookModule {}
