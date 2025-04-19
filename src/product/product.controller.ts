import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto, PaginationFilterDTO } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BaseResponseTypeDTO } from 'src/utils';
import { ProductTypes } from './entities/product.entity';

@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiOperation({ summary: 'Create a Product' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Product created',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  async createProduct(
    @Body() payload: CreateProductDto,
  ): Promise<BaseResponseTypeDTO> {
    const result = await this.productService.createProduct(
      payload
    );
    return result;
  }

  @Get()
  @ApiOperation({ summary: 'Admin find all products' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Get all products' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input' })
  @ApiQuery({
    name: 'productType',
    required: false,
    enum: ProductTypes,
    description: 'Filter by product type (optional)',
  })
  async findByProductTypes(
    @Query() filters: PaginationFilterDTO,
    @Query('productType') productType?: ProductTypes 
  ): Promise<BaseResponseTypeDTO> {
    const result = await this.productService.findByProductTypes(filters, productType);
    return result;
  }


  @Get(':id')
  @ApiOperation({ summary: 'Get a product by  Id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Product fetched',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  async getAProduct(
    @Param('id') id: string,       
  ): Promise<BaseResponseTypeDTO> {
    const result = await this.productService.getAProduct(id);
    return result;
  }
  

  @Patch(':id')
  @ApiOperation({ summary: 'Update a product' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Product update their account',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  async updateProduct(
    @Param('id') id: string,
    @Body() payload: UpdateProductDto,
  ): Promise<BaseResponseTypeDTO> {
    const result = await this.productService.updateProduct(id, payload);
    return result;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'delete product with a user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'product deleted',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  async deleteProduct(
    @Param('id') id: string,
  ): Promise<BaseResponseTypeDTO> {
    const result = await this.productService.deleteProduct(id);
    return result;
  }
}
