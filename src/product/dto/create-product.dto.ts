import { ApiProperty } from '@nestjs/swagger';
import { ProductTypes } from '../entities/product.entity';
import { BookingFilter } from 'src/booking/entities/booking.entity';

export class CreateProductDto {
  @ApiProperty({ example: 'Rice' })
  name: string;

  @ApiProperty({ example: 100 })
  amount: number;

  @ApiProperty({ example: 'Rice is good' })
  description?: string;

  @ApiProperty({ example: 'Main' })
  category?: string;

  @ApiProperty({ example: 'https://cloudinary.com/image' })
  imageUrl?: string;

  @ApiProperty({ default: ProductTypes.GENERAL })
  productType?: ProductTypes;
}

export class PaginationFilterDTO {
  @ApiProperty({
    required: false,
    description: 'Number of records per page',
    type: Number,
  })
  limit?: number;

  @ApiProperty({
    required: false,
    description: 'Page number for pagination',
    type: Number,
  })
  page?: number;

  @ApiProperty({
    required: false,
    description: 'Search term to filter the results',
    type: String,
  })
  search?: string;

  @ApiProperty({
    required: false,
    description: 'Category',
    type: String,
  })
  category?: string;

  @ApiProperty({
    required: false,
    description: 'Payment Status',
    type: String,
    enum: BookingFilter

  })
  paymentStatus?: string;

}
