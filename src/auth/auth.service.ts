import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto, RegisterAdminDto } from './dto/create-auth.dto';
import { BaseResponseTypeDTO } from 'src/utils';
import { InjectModel } from '@nestjs/mongoose';
import { Admin } from './entities/auth.entity';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Foodbox } from 'src/foodbox/entities/foodbox.entity';
import { Booking } from 'src/booking/entities/booking.entity';
import { Product } from 'src/product/entities/product.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Admin.name) private readonly adminModel: Model<Admin>,
    @InjectModel(Foodbox.name) private readonly foodboxModel: Model<Foodbox>,
    @InjectModel(Booking.name) private readonly bookingModel: Model<Booking>,
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
  ) {}

  async register(dto: RegisterAdminDto): Promise<BaseResponseTypeDTO> {
    const email = dto.email.toLowerCase();
    try {
      const validatedEmail = await this.adminModel.findOne({ email });
      if (validatedEmail) {
        throw new ConflictException('Email already exist');
      }

      const hashedPassword = await this.hashPassword(dto?.password);
      const admin = await this.adminModel.create({
        ...dto,
        password: hashedPassword,
      });

      const token = await this.generateJwt(admin);
      const data = {
        admin: await admin.save(),
        accessToken: token,
      };

      await admin.save();
      return {
        data,
        success: true,
        code: HttpStatus.OK,
        message: 'Admin Created',
      };
    } catch (error) {
      throw error;
    }
  }

  async login(dto: LoginDto): Promise<BaseResponseTypeDTO> {
    const email = dto.email.toLowerCase();
    try {
      const admin = await this.adminModel.findOne({ email }).exec();

      if (!admin) {
        throw new UnauthorizedException(
          'Incorrect email or password. try again',
        );
      }

      // Validate password
      const isPasswordValid = await this.confirmPassword(
        dto.password,
        admin.password,
      );
      if (!isPasswordValid) {
        throw new UnauthorizedException(
          'Incorrect email or password. try again ',
        );
      }
      // Generate JWT
      const accessToken = await this.generateJwt(admin);

      admin.lastLogged = new Date();
      await admin.save();

      return {
        data: { admin, accessToken },
        success: true,
        code: HttpStatus.OK,
        message: 'Login successful',
      };
    } catch (error) {
      throw error;
    }
  }

  async confirmPassword(plainPassword: string, hashedPassword: string) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  // Function to generate JWT
  async generateJwt(user: any) {
    const payload = { sub: user._id, phoneNumber: user.phoneNumber };
    const secret = process.env.JWT_SECRET;
    const token = jwt.sign(payload, secret, { expiresIn: '48h' });

    return token;
  }

  async hashPassword(password: string) {
    // Validate password length
    if (password.length < 8) {
      throw new BadRequestException(
        'Password must be at least 8 characters long',
      );
    }
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!hasNumber || !hasSpecialChar) {
      throw new BadRequestException(
        'Password must contain at least one number and one special character',
      );
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    return hashedPassword;
  }

  async getAdminDashboard(adminId: string): Promise<BaseResponseTypeDTO> {
    const admin = await this.adminModel.findById(adminId);
    if (!admin) {
      throw new NotFoundException('Admin not found.');
    }
  
    const [bookings, foodBoxes, products] = await Promise.all([
      this.bookingModel.find({ paymentStatus: 'paid' }),
      this.foodboxModel.find({ paymentStatus: 'paid' }),
      this.productModel.find(),
    ]);
  
    const totalSalesBooking = bookings.reduce(
      (sum, booking) => sum + (booking.amountToPay ?? 0),
      0,
    );
  
    const totalSalesFoodBox = foodBoxes.reduce(
      (sum, box) => sum + (box.amountPaid ?? 0),
      0,
    );
  
    const totalSales = totalSalesBooking + totalSalesFoodBox;
  
    return {
      data: {
        totalSales,
        totalSuccessBooking: bookings.length,
        totalSuccessFoodbox: foodBoxes.length,
        totalProduct: products.length,
      },
      success: true,
      code: HttpStatus.OK,
      message: 'Admin Dashboard',
    };
  }
  }
