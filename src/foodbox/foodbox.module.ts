import { forwardRef, Module } from '@nestjs/common';
import { FoodboxService } from './foodbox.service';
import { FoodboxController } from './foodbox.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from 'src/product/entities/product.entity';
import { ProductModule } from 'src/product/product.module';
import { UsersModule } from 'src/users/users.module';
import { User, UserSchema } from 'src/users/entities/user.entity';
import { Foodbox, FoodboxSchema } from './entities/foodbox.entity';
import { Plan, PlanSchema } from 'src/plan/entities/plan.entity';
import { PlanModule } from 'src/plan/plan.module';
import { Admin, AdminSchema } from 'src/auth/entities/auth.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Foodbox.name, schema: FoodboxSchema }]),
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    forwardRef(() => ProductModule),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    forwardRef(() => UsersModule),
    MongooseModule.forFeature([{ name: Plan.name, schema: PlanSchema }]),
    forwardRef(() => PlanModule),
    MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]),
    forwardRef(() => AuthModule),
  ],

  controllers: [FoodboxController],
  providers: [FoodboxService],
  exports: [FoodboxService],
})
export class FoodboxModule {}
