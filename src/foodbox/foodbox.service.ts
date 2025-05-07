import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateFoodboxDto } from './dto/create-foodbox.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Foodbox } from './entities/foodbox.entity';
import { Model } from 'mongoose';
import { UsersService } from 'src/users/users.service';
import { BaseResponseTypeDTO, IPaginationFilter } from 'src/utils';
import { Plan } from 'src/plan/entities/plan.entity';
import { PlanService } from 'src/plan/plan.service';
import { PaymentStatus } from 'src/booking/entities/booking.entity';
import { Admin } from 'src/auth/entities/auth.entity';
import { UpdateFoodboxDto } from './dto/update-foodbox.dto';
import { confirmFoodBox, formatDate } from 'src/Email/comfirmation';

@Injectable()
export class FoodboxService {
  constructor(
    @InjectModel(Foodbox.name) private readonly foodboxModel: Model<Foodbox>,
    @InjectModel(Plan.name) private readonly planModel: Model<Plan>,
    @InjectModel(Admin.name) private readonly adminModel: Model<Admin>,

    private readonly userSrv: UsersService,
    private readonly planSrv: PlanService,
  ) {}

  async createFoodbox(dto: CreateFoodboxDto): Promise<BaseResponseTypeDTO> {
    const email = dto.email.toLowerCase();
    const plan = await this.planModel.findById(dto.planId);
    if (!plan) {
      throw new NotFoundException('Plan not found');
    }

    await this.userSrv.createUser({
      name: dto.name,
      email,
      phoneNumber: dto.phoneNumber,
    });

    const foodbox = new this.foodboxModel({ ...dto });
    await foodbox.save();

    const buyPlan = await this.planSrv.buyPlan(dto.planId);
    foodbox.sessionId = buyPlan.stripePaymentId;
    foodbox.amountPaid = buyPlan.planAmount
    await foodbox.save();

    return {
      data: {
        paymentLink: buyPlan.paymentLink,
        foodbox,
      },
      success: true,
      code: HttpStatus.CREATED,
      message: 'Food Box Created',
    };
  }

  async findAllFoodBox(
    filters: IPaginationFilter,
  ): Promise<BaseResponseTypeDTO> {
    try {
      const searchFilter: any = {};
      if (filters.search) {
        const searchTerm = filters.search.trim();
        const userFields = Object.keys(this.foodboxModel.schema.obj);

        searchFilter.$or = userFields
          .map((field) => {
            const fieldType = this.foodboxModel.schema.obj[field]?.type;
            if (fieldType === String) {
              return {
                [field]: { $regex: searchTerm, $options: 'i' },
              };
            }
            return {};
          })
          .filter((condition) => Object.keys(condition).length > 0);
      }

      const limit = filters.limit || 100;
      const page = filters.page || 1;
      const skip = (page - 1) * limit;

      const totalCount = await this.foodboxModel.countDocuments(searchFilter);

      const data = await this.foodboxModel
        .find(searchFilter)
        .skip(skip)
        .limit(limit)
        .populate([
          { path: 'planId' },
          { path: 'itemsSelected.productId', model: 'Product' },
        ])
        .sort({ createdAt: -1 });

      if (!data || data.length === 0) {
        return {
          data: [],
          success: true,
          code: HttpStatus.OK,
          message: 'FoodBox Not Found',
          limit,
          page,
          search: filters?.search,
        };
      }

      return {
        data: {
          totalCount,
          data,
        },
        success: true,
        code: HttpStatus.OK,
        message: 'All FoodBox Found',
        limit: filters.limit,
        page: filters.page,
        search: filters.search,
      };
    } catch (ex) {
      throw ex;
    }
  }

  async findFoodboxByUser(
    filters: IPaginationFilter,
    email?: string,
  ): Promise<BaseResponseTypeDTO> {
    try {
      const searchFilter: any = {};

      // Search across string fields
      if (filters.search) {
        const searchTerm = filters.search.trim();
        const userFields = Object.keys(this.foodboxModel.schema.obj);

        searchFilter.$or = userFields
          .map((field) => {
            const fieldType = this.foodboxModel.schema.obj[field]?.type;
            if (fieldType === String) {
              return {
                [field]: { $regex: searchTerm, $options: 'i' },
              };
            }
            return {};
          })
          .filter((condition) => Object.keys(condition).length > 0);
      }

      // Filter by email if provided
      if (email) {
        searchFilter.email = email;
      }

      const limit = filters.limit || 100;
      const page = filters.page || 1;
      const skip = (page - 1) * limit;

      const totalCount = await this.foodboxModel.countDocuments(searchFilter);

      const data = await this.foodboxModel
        .find(searchFilter)
        .skip(skip)
        .limit(limit)
        .populate([
          { path: 'planId' },
          { path: 'itemsSelected.productId', model: 'Product' },
        ])
        .sort({ createdAt: -1 });

      if (!data || data.length === 0) {
        return {
          data: [],
          success: true,
          code: HttpStatus.OK,
          message: 'No Foodbox Found',
          limit,
          page,
          search: filters?.search,
        };
      }

      return {
        data: {
          totalCount,
          data,
        },
        success: true,
        code: HttpStatus.OK,
        message: 'All Foodboxes Found',
        limit,
        page,
        search: filters.search,
      };
    } catch (ex) {
      throw ex;
    }
  }

  async getAFoodBox(boxId: string): Promise<BaseResponseTypeDTO> {
    try {
      const foodbox = await this.foodboxModel
        .findOne({ _id: boxId })
        .populate('planId');

      if (!foodbox) {
        throw new NotFoundException(`Foodbox not found.`);
      }

      return {
        data: foodbox,
        success: true,
        code: HttpStatus.OK,
        message: 'Foodbox Fetched',
      };
    } catch (ex) {
      throw ex;
    }
  }

  async adminUpdatAFoodbox(
    adminId: string,
    foodboxId: string,
    dto: UpdateFoodboxDto,
  ): Promise<BaseResponseTypeDTO> {
    try {
      const admin = await this.adminModel.findOne({ _id: adminId });

      if (!admin) {
        throw new NotFoundException(`Admin not found.`);
      }

      const fooxdbox = await this.foodboxModel.findOne({ _id: foodboxId });

      if (!fooxdbox) {
        throw new NotFoundException(`Fooxdbox not found.`);
      }

      Object.assign(fooxdbox, dto);
      await fooxdbox.save();

      return {
        data: fooxdbox,
        success: true,
        code: HttpStatus.OK,
        message: 'fooxdbox updated successfully',
      };
    } catch (ex) {
      throw ex;
    }
  }

  async adminDeleAFoodbox(
    adminId: string,
    foodboxId: string,
  ): Promise<BaseResponseTypeDTO> {
    try {
      const admin = await this.adminModel.findOne({ _id: adminId });

      if (!admin) {
        throw new NotFoundException(`admin not found.`);
      }
      const foodBox = await this.foodboxModel.findOne({ _id: foodboxId });

      if (!foodBox) {
        throw new NotFoundException(`FoodBox not found.`);
      }
      await foodBox.deleteOne();

      return {
        success: true,
        code: HttpStatus.OK,
        message: 'FoodBox Deleted',
      };
    } catch (ex) {
      throw ex;
    }
  }

  async markAsPaidFoodbox(sessionId: string) {
    const foodbox = await this.foodboxModel.findOne({ sessionId });
    if (foodbox) {
      foodbox.paymentStatus = PaymentStatus.PAID;
      await foodbox.save();
    }

    const foodBoxPayload = {
      deliveryDate: formatDate(foodbox.deliveryDate),
      itemsSelected: foodbox?.itemsSelected,
      subject: `We've Received Your Meal Choices - Delivery On ${formatDate(foodbox.deliveryDate)}`,
      firstName: foodbox.name,
    };

    await confirmFoodBox(foodBoxPayload)
  }


}
