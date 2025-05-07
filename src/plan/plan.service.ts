import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Plan } from './entities/plan.entity';
import { Model } from 'mongoose';
import { BaseResponseTypeDTO } from 'src/utils';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET, {
  apiVersion: '2025-03-31.basil',
});

@Injectable()
export class PlanService {
  constructor(
    @InjectModel(Plan.name) private readonly planModel: Model<Plan>,
  ) {}

  async createPlan(dto: CreatePlanDto): Promise<BaseResponseTypeDTO> {
    const plan = new this.planModel({ ...dto });
    await plan.save();
    return {
      data: plan,
      success: true,
      code: HttpStatus.CREATED,
      message: 'Plan Created',
    };
  }

  async getPlans(): Promise<BaseResponseTypeDTO> {
    const plans = await this.planModel.find();
    if (!plans || plans.length === 0) {
      return {
        data: [],
        success: true,
        code: HttpStatus.OK,
        message: 'No Plan Availabele',
      };
    }

    return {
      data: plans,
      success: true,
      code: HttpStatus.OK,
      message: 'Plans Fetched',
    };
  }

  async getAPlan(id: string): Promise<BaseResponseTypeDTO> {
    const plan = await this.planModel.findById(id);
    if (!plan) {
      throw new NotFoundException('Plan not found');
    }

    return {
      data: plan,
      success: true,
      code: HttpStatus.OK,
      message: 'Plan Fetched',
    };
  }

  async updatePlan(
    PlanId: string,
    payload: UpdatePlanDto,
  ): Promise<BaseResponseTypeDTO> {
    try {
      const record = await this.planModel.findOne({ _id: PlanId });

      if (!record) {
        throw new NotFoundException(
          `Plan not found, therefore cannot be updated.`,
        );
      }

      if ('name' in payload) {
        record.name = payload.name;
      }

      if ('amount' in payload) {
        record.amount = payload.amount;
      }

      if ('description' in payload) {
        record.description = payload.description;
      }

      const updatedPlan = await record.save();

      return {
        data: updatedPlan,
        success: true,
        code: HttpStatus.OK,
        message: 'Plan Updated',
      };
    } catch (ex) {
      throw ex;
    }
  }

  async deletePlan(PlanId: string): Promise<BaseResponseTypeDTO> {
    try {
      const Plan = await this.planModel.findOne({ _id: PlanId });

      if (!Plan) {
        throw new NotFoundException(`Plan not found.`);
      }

      await this.planModel.findByIdAndDelete(PlanId);

      return {
        success: true,
        code: HttpStatus.OK,
        message: 'Plan Deleted',
      };
    } catch (ex) {
      throw ex;
    }
  }

  async buyPlan(id: string) {
    const plan = await this.planModel.findById(id);
    if (!plan) {
      throw new NotFoundException('Plan not found');
    }

    // const user = await this.userModel.findOne({email});
    // if (!user) {
    //   throw new NotFoundException('user not found');
    // }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: `${plan.name}`,
            },
            unit_amount: Math.round(plan.amount * 100),
          },
          quantity: 1,
        },
      ],
      success_url: 'https://www.walegrills.com/thank-you',
    });

    return {
      paymentLink: session.url,
      stripePaymentId: session.id,
      planAmount: plan.amount
    };
  }
}
