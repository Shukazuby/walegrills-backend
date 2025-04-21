import { ApiProperty } from '@nestjs/swagger';
import { UserPrefix } from 'src/booking/dto/create-booking.dto';
import { Items } from 'src/booking/entities/booking.entity';

export class CreateFoodboxDto {
  @ApiProperty({ example: 'Mrs' })
  prefix: UserPrefix;

  @ApiProperty({ example: 'John' })
  name: string;

  @ApiProperty({ example: '6803e77f7100f180cb00c5d3' })
  planId: string;

  @ApiProperty({ example: 'Johndoe@example.com', required: true })
  email: string;

  @ApiProperty({ example: '2025-08-10 16:00:00' })
  deliveryDate: Date;

  @ApiProperty({ example: '9000000000' })
  phoneNumber: string;

  @ApiProperty({ example: 'Basildon Station' })
  deliveryAddress: string;

  @ApiProperty({ type: () => [Items] })
  itemsSelected: Items[];
}
