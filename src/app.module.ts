import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookingModule } from './booking/booking.module';
import { ProductModule } from './product/product.module';
import * as dotenv from 'dotenv';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { PlanModule } from './plan/plan.module';
import { FoodboxModule } from './foodbox/foodbox.module';
import { WebhookController } from './webhook/webhook.controller';
import { AuthModule } from './auth/auth.module';
dotenv.config();
@Module({
  imports: [
    MongooseModule.forRoot(String(process.env.MONGODB_URL).trim()),
    BookingModule,
    ProductModule,
    UsersModule,
    PlanModule,
    FoodboxModule,
    AuthModule,
  ],
  controllers: [AppController, WebhookController],
  providers: [AppService],
})
export class AppModule {}
