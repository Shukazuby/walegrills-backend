import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';
import { BaseResponseTypeDTO, IPaginationFilter } from 'src/utils';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async createUser(dto: CreateUserDto) {
    const email = dto.email.toLowerCase();
    let user = await this.userModel.findOne({ email });
  
    // If user doesn't exist, create new
    if (!user) {
      user = new this.userModel({
        ...dto,
        email, // make sure to store lowercase email
      });
      await user.save();
      return;
    }
  
    // If user exists, update fields only if needed
    let shouldSave = false;
  
    if (!user.phoneNumber || user.phoneNumber !== dto.phoneNumber) {
      user.phoneNumber = dto.phoneNumber;
      shouldSave = true;
    }
  
    if (!user.name || user.name !== dto.name) {
      user.name = dto.name;
      shouldSave = true;
    }
  
    if (!user.prefix || user.prefix !== dto.prefix) {
      user.prefix = dto.prefix;
      shouldSave = true;
    }
  
    if (shouldSave) {
      await user.save();
    }
  }
  
    async findAllUsers(
      filters: IPaginationFilter,
    ): Promise<BaseResponseTypeDTO> {
      try {
        const searchFilter: any = {};
        if (filters.search) {
          const searchTerm = filters.search.trim();
          const userFields = Object.keys(this.userModel.schema.obj);
  
          searchFilter.$or = userFields
            .map((field) => {
              const fieldType = this.userModel.schema.obj[field]?.type;
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
  
        const totalCount = await this.userModel.countDocuments(searchFilter);
  
        const data = await this.userModel
          .find(searchFilter)
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 });
          
  
        if (!data || data.length === 0) {
          return {
            data: [],
            success: true,
            code: HttpStatus.OK,
            message: 'Users Not Found',
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
          message: 'All Users Found',
          limit: filters.limit,
          page: filters.page,
          search: filters.search,
        };
      } catch (ex) {
        throw ex;
      }
    }

    async getAUser(id: string): Promise<BaseResponseTypeDTO> {
      try {
        const user = await this.userModel.findOne({_id: id});
  
        if (!user) {
          throw new NotFoundException(`user not found.`);
        }
  
        return {
          data: user,
          success: true,
          code: HttpStatus.OK,
          message: 'user Fetched',
        };
      } catch (ex) {
        throw ex;
      }
    }

}
