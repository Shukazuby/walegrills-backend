import { ApiProperty } from '@nestjs/swagger';
import { Items, PaymentOptionss } from '../entities/booking.entity';
export enum UserPrefix {
  MRS = 'Mrs',
  MR = 'Mr',
  MS = 'Ms',
}

export class CreateBookingDto {
  @ApiProperty({example: 'Mrs'})
  prefix: UserPrefix;

  @ApiProperty({example: 'John'})
  name: string;
  
  @ApiProperty({example: 'Johndoe@example.com'})
  email: string;
  
  @ApiProperty({example: 250})
  numberOfGuests: number;
  
  @ApiProperty({example: '2025-08-10 16:00:00'})
  eventDate: Date;
  
  @ApiProperty({example: 6})
  serviceTime: number;
  
  @ApiProperty({example: 'Buffet'})
  eventStyle?: string;
  
  @ApiProperty({example: '9000000000'})
  phoneNumber: string;
  
  @ApiProperty({example: 'Basildon Station'})
  eventVenue: string;
  
  @ApiProperty({example: 'Birthday'})
  eventType?: string;
  
  @ApiProperty({example: 'The Event Starts by 12pm'})
  note?: string;
  
  @ApiProperty({example: '100'})
  paymentOption: PaymentOptionss;

  @ApiProperty({ type: () => [Items] })
  itemsNeeded: Items[];
}
