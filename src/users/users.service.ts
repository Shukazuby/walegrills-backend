import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';

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
  
  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
