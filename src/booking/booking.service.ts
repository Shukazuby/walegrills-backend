import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import axios from 'axios';
import Stripe from 'stripe';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Booking, PaymentStatus } from './entities/booking.entity';
import * as dotenv from 'dotenv';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from 'src/product/entities/product.entity';
import {
  BaseResponseTypeDTO,
  generateUniqueKey,
  IPaginationFilter,
} from 'src/utils';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import {
  calculatePaymentDeadline,
  confirmBookingBalance,
  confirmBookingEmail,
  confirmFullPaymentBookingEmail,
  formatDate,
  PaymentReminderEmail,
} from 'src/Email/comfirmation';
import { first } from 'rxjs';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Admin } from 'src/auth/entities/auth.entity';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET, {
  apiVersion: '2025-03-31.basil',
});

const origin = 'SE28 8LL, Thamesmead';

@Injectable()
export class BookingService {
  constructor(
    @InjectModel(Booking.name) private readonly bookingModel: Model<Booking>,
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Admin.name) private readonly adminModel: Model<Admin>,

    private readonly userSrv: UsersService,
  ) {}

  async calculateEventCostss({ guestCount, menuItemCount, distanceInMiles }) {
    // Calculate staff
    const waiters = Math.ceil(guestCount / 25);
    const chefs = Math.ceil(guestCount / 50);

    // Calculate equipment
    const equipmentUnits = Math.ceil(guestCount / 25);
    const equipmentCost = equipmentUnits * 20;

    // Calculate service time
    const cookingTime = Math.ceil(menuItemCount / 2); // 1 hr per 2 items
    const setupTime = 1;
    const teardownTime = 1;
    const totalServiceHours = cookingTime + setupTime + teardownTime;

    // Calculate service charge
    const serviceCharge = totalServiceHours * 50;

    // Calculate transportation cost
    const transportMilesCost = Math.ceil(distanceInMiles / 35) * 50;
    const transportCost = 150 + transportMilesCost;

    // Final cost breakdown
    const totalCost = serviceCharge + equipmentCost + transportCost;

    return {
      guestCount,
      waiters,
      chefs,
      equipmentCost,
      serviceHours: totalServiceHours,
      serviceCharge,
      transportCost,
      totalCost,
    };
  }

  async calculateDistance(
    destination: string,
  ): Promise<{ distance: number; duration: number }> {
    try {
      const url = `https://maps.googleapis.com/maps/api/distancematrix/json`;

      const res = await axios.get(url, {
        params: {
          origins: origin, 
          destinations: destination,
          key: process.env.GOOGLE_API_KEY,
        },
      });
      const element = res.data.rows[0].elements[0];

      if (element.status !== 'OK') {
        throw new BadRequestException(
          `Could not retrieve distance/duration. Please confirm event venue`,
        );
      }

      const distanceInMeters = element.distance.value; 
      const durationInSeconds = element.duration.value; // seconds

      const distanceInMiles = distanceInMeters / 1609.34;
      const durationInHours = durationInSeconds / 3600;

      return {
        distance: distanceInMiles,
        duration: durationInHours,
      };
    } catch (error) {
      throw error;
    }
  }

  async createBooking(dto: CreateBookingDto): Promise<BaseResponseTypeDTO> {
  try {
    await this.userSrv.createUser(dto);
    const email = dto.email.toLowerCase();
    const distance = await this.calculateDistance(dto.eventVenue);
    const distanceHour = distance.duration;
    const guests = dto.numberOfGuests;
    let balanceDue = 0;
    // const serviceTime = dto.serviceTime;

    let chefRate = 0;
    let waiterRate = 0;
    const itemCount = dto.itemsNeeded.length;

    const calculateEvent = await this.calculateEventCostss({
      guestCount: guests,
      menuItemCount: itemCount,
      distanceInMiles: distance.distance,
    });
    // Staff rates
    if (calculateEvent.serviceHours <= 5) {
      chefRate = 18.5;
      waiterRate = 12.5;
    } else if (calculateEvent.serviceHours <= 10) {
      chefRate = 20;
      waiterRate = 13.5;
    } else if (calculateEvent.serviceHours <= 15) {
      chefRate = 22.5;
      waiterRate = 14.5;
    }

    const chefCal = calculateEvent.chefs * chefRate;
    const waiterCal = calculateEvent.waiters * waiterRate;

    const chefCost = calculateEvent.serviceHours * chefCal;
    const waiterCost = calculateEvent.serviceHours * waiterCal;

    // Fetch product item costs
    let itemsTotal = 0;
    for (const item of dto.itemsNeeded || []) {
      const product = await this.productModel.findById(item.productId).exec();
      if (!product) {
        throw new Error(`Product with ID ${item.productId} not found`);
      }
      itemsTotal += product.amount * item.quantity;
    }

    // Calculate total fee
    const totalFee =
      chefCost + waiterCost + calculateEvent.totalCost + itemsTotal;

    let amountToPay =
      chefCost + waiterCost + calculateEvent.totalCost + itemsTotal;
    if (dto.paymentOption === 40) {
      amountToPay = totalFee * 0.4;
      balanceDue = totalFee - amountToPay;
    }

    // Stripe checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: 'Event Booking',
            },
            unit_amount: Math.round(amountToPay * 100),
          },
          quantity: 1,
        },
      ],
      success_url: 'https://www.walegrills.com/thank-you',
    });

    const session2 = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: 'Event Booking',
            },
            unit_amount: Math.round(balanceDue * 100),
          },
          quantity: 1,
        },
      ],
      success_url: 'https://www.walegrills.com/thank-you',
    });

    const invoiceNo = await generateUniqueKey(7);
    // Save to DB
    const booking = new this.bookingModel({
      ...dto,
      email,
      totalFee: Math.round(totalFee * 100) / 100,
      amountToPay: Math.round(amountToPay * 100) / 100,
      serviceTime: calculateEvent.serviceHours,
      invoiceNumber: invoiceNo,
      distance: distance.distance,
      eventDate: new Date(dto.eventDate),
      balanceDue: Math.round(balanceDue * 100) / 100,
      itemsTotal,
      isHalfPayment: false,
      serviceCharge: calculateEvent.serviceCharge,
      chefs: calculateEvent.chefs,
      waiters: calculateEvent.waiters,
      transportation: calculateEvent.transportCost,
      equipment: calculateEvent.equipmentCost,
    });

    if (dto.paymentOption === 40) {
      booking.balancePaymentLink = session2.url;
      booking.isHalfPayment = true;
      booking.isBalanceReminder = false;
      await booking.save();
    }

    booking.sessionId = session?.id;
    booking.balanceSessionId = session2?.id;
    await booking.save();

    const user = await this.userModel.findOne({ email });
    if (user) {
      booking.userId = user._id.toString();
      await booking.save();
    }
    return {
      data: {
        stripePaymentId: session.id,
        paymentLink: session.url,
        booking,
      },
      success: true,
      code: HttpStatus.CREATED,
      message: 'Booking Initiated',
    };
  } catch (error) {
    console.error('Booking creation failed:', error);
    throw error;
  }
}


  // async createBooking(dto: CreateBookingDto): Promise<BaseResponseTypeDTO> {
  //   try {
  //     await this.userSrv.createUser(dto);
  //     const email = dto.email.toLowerCase();
  //     const distance = await this.calculateDistance(dto.eventVenue);
  //     const distanceHour = distance.duration;
  //     const guests = dto.numberOfGuests;
  //     let balanceDue = 0;
  //     // const serviceTime = dto.serviceTime;

  //     let chefs = 0;
  //     let waiters = 0;
  //     let equipmentCost = 0;
  //     let chefRate = 0;
  //     let waiterRate = 0;
  //     let chargePermile = 0;
  //     let transportation = 0;
  //     let driverChargePh = 0;
  //     let serviceTime = 0;

  //     // Staff & equipment
  //     if (guests <= 100) {
  //       chefs = 1;
  //       waiters = 2;
  //       equipmentCost = 50;
  //       serviceTime = 6;
  //     } else if (guests <= 200) {
  //       chefs = 2;
  //       waiters = 4;
  //       equipmentCost = 100;
  //       serviceTime = 7;
  //     } else if (guests <= 300) {
  //       chefs = 4;
  //       waiters = 5;
  //       equipmentCost = 250;
  //       serviceTime = 8;
  //     } else if (guests <= 400) {
  //       chefs = 4;
  //       waiters = 6;
  //       equipmentCost = 300;
  //       serviceTime = 9;
  //     } else if (guests <= 500) {
  //       chefs = 4;
  //       waiters = 8;
  //       equipmentCost = 350;
  //       serviceTime = 10;
  //     }

  //     // Staff rates
  //     if (serviceTime <= 5) {
  //       chefRate = 18.5;
  //       waiterRate = 12.5;
  //     } else if (serviceTime <= 10) {
  //       chefRate = 20;
  //       waiterRate = 13.5;
  //     } else if (serviceTime <= 15) {
  //       chefRate = 22.5;
  //       waiterRate = 14.5;
  //     }

  //     // Driver charge by hour
  //     if (distanceHour < 1) driverChargePh = 10;
  //     else if (distanceHour < 2) driverChargePh = 20;
  //     else if (distanceHour < 3) driverChargePh = 30;
  //     else if (distanceHour < 4) driverChargePh = 40;

  //     // Transportation
  //     if (distance.distance < 10) {
  //       chargePermile = 1;
  //     } else if (distance.distance <= 20) {
  //       chargePermile = 0.9;
  //     } else {
  //       chargePermile = 0.8;
  //     }

  //     transportation = chargePermile * distance.distance + driverChargePh;

  //     // Staff cost
  //     const chefCost = chefs * chefRate * serviceTime;
  //     const waiterCost = waiters * waiterRate * serviceTime;

  //     // Fetch product item costs
  //     let itemsTotal = 0;

  //     for (const item of dto.itemsNeeded || []) {
  //       const product = await this.productModel.findById(item.productId).exec();
  //       if (!product) {
  //         throw new Error(`Product with ID ${item.productId} not found`);
  //       }
  //       itemsTotal += product.amount * item.quantity;
  //     }

  //     // Calculate total fee
  //     const totalFee =
  //       chefCost + waiterCost + equipmentCost + transportation + itemsTotal;

  //     let amountToPay =
  //       chefCost + waiterCost + equipmentCost + transportation + itemsTotal;
  //     if (dto.paymentOption === 40) {
  //       amountToPay = totalFee * 0.4;
  //       balanceDue = totalFee - amountToPay;
  //     }

  //     // balancePaymentLink: Math.round(booking.balancePaymentLink * 100) / 100

  //     // Stripe checkout
  //     const session = await stripe.checkout.sessions.create({
  //       payment_method_types: ['card'],
  //       mode: 'payment',
  //       line_items: [
  //         {
  //           price_data: {
  //             currency: 'gbp',
  //             product_data: {
  //               name: 'Event Booking',
  //             },
  //             unit_amount: Math.round(amountToPay * 100),
  //           },
  //           quantity: 1,
  //         },
  //       ],
  //       success_url: 'https://www.walegrills.com/thank-you',
  //     });

  //     const session2 = await stripe.checkout.sessions.create({
  //       payment_method_types: ['card'],
  //       mode: 'payment',
  //       line_items: [
  //         {
  //           price_data: {
  //             currency: 'gbp',
  //             product_data: {
  //               name: 'Event Booking',
  //             },
  //             unit_amount: Math.round(balanceDue * 100),
  //           },
  //           quantity: 1,
  //         },
  //       ],
  //       success_url: 'https://www.walegrills.com/thank-you',
  //     });

  //     const invoiceNo = await generateUniqueKey(7);
  //     // Save to DB
  //     const booking = new this.bookingModel({
  //       ...dto,
  //       email,
  //       totalFee: Math.round(totalFee * 100) / 100,
  //       amountToPay: Math.round(amountToPay * 100) / 100,
  //       serviceTime,
  //       invoiceNumber: invoiceNo,
  //       distance: distance.distance,
  //       eventDate: new Date(dto.eventDate),
  //       balanceDue: Math.round(balanceDue * 100) / 100,
  //       itemsTotal,
  //       isHalfPayment: false
  //     });

  //     if (dto.paymentOption === 40) {
  //       booking.balancePaymentLink = session2.url;
  //       booking.isHalfPayment = true;
  //       booking.isBalanceReminder = false;
  //       await booking.save();
  //     }

  //     booking.sessionId = session?.id;
  //     booking.balanceSessionId = session2?.id;
  //     await booking.save();

  //     const user = await this.userModel.findOne({ email });
  //     if (user) {
  //       booking.userId = user._id.toString();
  //       await booking.save();
  //     }

  //     return {
  //       data: {
  //         paymentLink: session.url,
  //         booking,
  //         stripePaymentId: session.id,
  //       },
  //       success: true,
  //       code: HttpStatus.CREATED,
  //       message: 'Booking Initiated',
  //     };
  //   } catch (error) {
  //     console.error('Booking creation failed:', error);
  //     throw error;
  //   }
  // }


  async findAllBookings(
    filters: IPaginationFilter & {
      paymentStatus?: string;
    },
  ): Promise<BaseResponseTypeDTO> {
    try {
      const searchFilter: any = {};

      // Handle search
      if (filters.search) {
        const searchTerm = filters.search.trim();
        const userFields = Object.keys(this.bookingModel.schema.obj);

        searchFilter.$or = userFields
          .map((field) => {
            const fieldType = this.bookingModel.schema.obj[field]?.type;
            if (fieldType === String) {
              return {
                [field]: { $regex: searchTerm, $options: 'i' },
              };
            }
            return {};
          })
          .filter((condition) => Object.keys(condition).length > 0);
      }

      // Apply payment filters
      if (filters.paymentStatus === 'paid') {
        searchFilter.paymentStatus = 'paid';
      }

      if (filters.paymentStatus === 'allBalDue') {
        searchFilter.paymentStatus = 'paid';
        searchFilter.isHalfPayment = true;
      }

      if (filters.paymentStatus === 'allFullyPaid') {
        searchFilter.paymentStatus = 'paid';
        searchFilter.isHalfPayment = false;
      }

      if (filters.paymentStatus === 'pending') {
        searchFilter.paymentStatus = 'pending';
      }

      const limit = filters.limit || 100;
      const page = filters.page || 1;
      const skip = (page - 1) * limit;

      const totalCount = await this.bookingModel.countDocuments(searchFilter);

      const data = await this.bookingModel
        .find(searchFilter)
        .skip(skip)
        .limit(limit)
        .populate([
          { path: 'userId' },
          { path: 'itemsNeeded.productId', model: 'Product' },
        ])
        .sort({ createdAt: -1 });

      if (!data || data.length === 0) {
        return {
          data: [],
          success: true,
          code: HttpStatus.OK,
          message: 'Bookings Not Found',
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
        message: 'All Bookings Found',
        limit,
        page,
        search: filters?.search,
      };
    } catch (ex) {
      throw ex;
    }
  }

  async findBookingsByUser(
    filters: IPaginationFilter,
    email?: string,
  ): Promise<BaseResponseTypeDTO> {
    try {
      const searchFilter: any = {};

      // Search across string fields
      if (filters.search) {
        const searchTerm = filters.search.trim();
        const userFields = Object.keys(this.bookingModel.schema.obj);

        searchFilter.$or = userFields
          .map((field) => {
            const fieldType = this.bookingModel.schema.obj[field]?.type;
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

      const totalCount = await this.bookingModel.countDocuments(searchFilter);

      const data = await this.bookingModel
        .find(searchFilter)
        .skip(skip)
        .limit(limit)
        .populate([
          { path: 'userId' },
          { path: 'itemsNeeded.productId', model: 'Product' },
        ])
        .sort({ createdAt: -1 });

      if (!data || data.length === 0) {
        return {
          data: [],
          success: true,
          code: HttpStatus.OK,
          message: 'Bookings Not Found',
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
        message: 'All Bookings Found',
        limit,
        page,
        search: filters.search,
      };
    } catch (ex) {
      throw ex;
    }
  }

  async getABooking(bookingId: string): Promise<BaseResponseTypeDTO> {
    try {
      const booking = await this.bookingModel.findOne({ _id: bookingId });

      if (!booking) {
        throw new NotFoundException(`Booking not found.`);
      }

      return {
        data: booking,
        success: true,
        code: HttpStatus.OK,
        message: 'Booking Fetched',
      };
    } catch (ex) {
      throw ex;
    }
  }

  async adminUpdatABooking(
    adminId: string,
    bookingId: string,
    dto: UpdateBookingDto,
  ): Promise<BaseResponseTypeDTO> {
    try {
      const admin = await this.adminModel.findOne({ _id: adminId });

      if (!admin) {
        throw new NotFoundException(`Admin not found.`);
      }

      const booking = await this.bookingModel.findOne({ _id: bookingId });

      if (!booking) {
        throw new NotFoundException(`Booking not found.`);
      }

      Object.assign(booking, dto);
      booking.updatedBy = admin.firstName;
      booking.updatedByAdminId = admin._id.toString();
      await booking.save();

      return {
        data: booking,
        success: true,
        code: HttpStatus.OK,
        message: 'Booking updated successfully',
      };
    } catch (ex) {
      throw ex;
    }
  }

  async adminDeleABooking(
    adminId: string,
    bookingId: string,
  ): Promise<BaseResponseTypeDTO> {
    try {
      const admin = await this.adminModel.findOne({ _id: adminId });

      if (!admin) {
        throw new NotFoundException(`admin not found.`);
      }
      const booking = await this.bookingModel.findOne({ _id: bookingId });

      if (!booking) {
        throw new NotFoundException(`Booking not found.`);
      }
      await booking.deleteOne();

      return {
        success: true,
        code: HttpStatus.OK,
        message: 'Booking Deleted',
      };
    } catch (ex) {
      throw ex;
    }
  }

  async findBookingsWithPendingBal(
    adminId: string,
    filters: IPaginationFilter,
  ): Promise<BaseResponseTypeDTO> {
    try {
      const admin = await this.adminModel.findOne({ _id: adminId });

      if (!admin) {
        throw new NotFoundException(`admin not found.`);
      }

      const searchFilter: any = {
        isHalfPayment: true, // Filter for bookings with pending balance
      };

      if (filters.search) {
        const searchTerm = filters.search.trim();
        const userFields = Object.keys(this.bookingModel.schema.obj);

        searchFilter.$or = userFields
          .map((field) => {
            const fieldType = this.bookingModel.schema.obj[field]?.type;
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

      const totalCount = await this.bookingModel.countDocuments(searchFilter);

      const data = await this.bookingModel
        .find(searchFilter)
        .skip(skip)
        .limit(limit)
        .populate([
          { path: 'userId' },
          { path: 'itemsNeeded.productId', model: 'Product' },
        ])
        .sort({ createdAt: -1 });

      if (!data || data.length === 0) {
        return {
          data: [],
          success: true,
          code: HttpStatus.OK,
          message: 'Bookings Not Found',
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
        message: 'Bookings with pending balance found',
        limit,
        page,
        search: filters?.search,
      };
    } catch (ex) {
      throw ex;
    }
  }

  async markAsPaidBookingBalance(sessionId: string) {
    const booking = await this.bookingModel
      .findOne({ balanceSessionId: sessionId })
      .populate([
        { path: 'userId' },
        { path: 'itemsNeeded.productId', model: 'Product' },
      ]);
    if (booking) {
      booking.paymentStatus = PaymentStatus.PAID;
      booking.amountToPay =
        Math.round(booking.amountToPay * 100) / 100 +
        Math.round(booking.balanceDue * 100) / 100;
      booking.isHalfPayment = false;
      await booking.save();
    }

    const eventDate = formatDate(booking.eventDate);

    if (booking?.paymentOption === 40) {
      const bookingPayload = {
        eventDate: eventDate,
        deposit: Math.round(booking.balanceDue * 100) / 100,
        itemsSelected: booking?.itemsNeeded,
        subject: `Payment Complete! We’re All Set for Your Event - ${eventDate}`,
        recepient: booking.email,
        name: booking.name,
      };
      await confirmBookingBalance(bookingPayload);
    }
  }

  async markAsPaidBooking(sessionId: string) {
    const booking = await this.bookingModel
      .findOne({ sessionId: sessionId })
      .populate([
        { path: 'userId' },
        { path: 'itemsNeeded.productId', model: 'Product' },
      ]);
    if (booking) {
      booking.paymentStatus = PaymentStatus.PAID;
      await booking.save();
    }

    const eventDate = formatDate(booking.eventDate);

    if (booking?.paymentOption === 40) {
      const deadlineDate = await calculatePaymentDeadline(
        booking.eventDate.toString(),
      );
      const bookingPayload = {
        balance:
          Math.round((booking.totalFee - booking.amountToPay) * 100) / 100,
        paymentDeadline: deadlineDate,
        eventDate: eventDate,
        deposit: Math.round(booking.amountToPay * 100) / 100,
        itemsSelected: booking?.itemsNeeded,
        subject: `Catering Booking Confirmation - ${eventDate}`,
        recepient: booking.email,
        firstName: booking.name,
        balancePaymentLink: booking.balancePaymentLink,
      };
      await confirmBookingEmail(bookingPayload);
    }

    if (booking?.paymentOption === 100) {
      const bookingPayload = {
        eventDate: eventDate,
        deposit: Math.round(booking.amountToPay * 100) / 100,
        itemsSelected: booking?.itemsNeeded,
        subject: `Catering Booking Confirmation - ${eventDate}`,
        recepient: booking.email,
        firstName: booking.name,
      };
      await confirmFullPaymentBookingEmail(bookingPayload);
    }
  }

  async BalanceReminder() {
    const bookings = await this.bookingModel
      .find({
        isHalfPayment: true,
        isBalanceReminder: false,
        paymentStatus: 'paid',
        paymentOption: 40,
      })
      .populate([
        { path: 'userId' },
        { path: 'itemsNeeded.productId', model: 'Product' },
      ]);

    if (!bookings || bookings.length === 0) return;

    for (const book of bookings) {
      const deadlineDate = await calculatePaymentDeadline(
        book.eventDate.toString(),
      );

      const today = new Date();
      const isDue = new Date(deadlineDate) <= today;

      if (isDue) {
        const bookingPayload = {
          eventDate: formatDate(book.eventDate),
          deposit: Math.round(book.amountToPay * 100) / 100,
          deadline: formatDate(deadlineDate),
          balance: Math.round(book.balanceDue),
          itemsSelected: book?.itemsNeeded,
          subject: `Balance Reminder: Complete Your Wale Grills Booking - ${formatDate(deadlineDate)}`,
          recepient: book.email,
          firstName: book.name,
          balancePaymentLink: book.balancePaymentLink,
        };
        console.log('###############');

        await PaymentReminderEmail(bookingPayload);
        console.log('*********');
        book.isBalanceReminder = true;
        book.updatedAt = new Date();
        await book.save();
      }
    }
  }
}
