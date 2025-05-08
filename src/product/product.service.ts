import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './entities/product.entity';
import { Model } from 'mongoose';
import { BaseResponseTypeDTO, IPaginationFilter } from 'src/utils';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
  ) {}

  async uploadFile(buffer: Buffer, folder = 'uploads'): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream({ folder }, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
      Readable.from(buffer).pipe(stream);
    });
  }

  // async createProduct(dto: CreateProductDto, imageFile: Express.Multer.File): Promise<BaseResponseTypeDTO> {
  //   // Upload to Cloudinary
  //   const cloudinaryResult = await this.uploadFile(imageFile.buffer, 'products');
  
  //   const product = new this.productModel({
  //     ...dto,
  //     imageurl: cloudinaryResult.secure_url,
  //   });
  
  //   await product.save();
  
  //   return {
  //     data: product,
  //     success: true,
  //     code: HttpStatus.CREATED,
  //     message: 'Product Created',
  //   };
  // }
  

  async createProduct(dto: CreateProductDto): Promise<BaseResponseTypeDTO> {
    const product = new this.productModel({ ...dto });
    await product.save();
    return {
      data: product,
      success: true,
      code: HttpStatus.CREATED,
      message: 'Product Created',
    };
  }

  async findAllProducts(
    filters: IPaginationFilter,
  ): Promise<BaseResponseTypeDTO> {
    try {
      const searchFilter: any = {};
      if (filters.search) {
        const searchTerm = filters.search.trim();
        const userFields = Object.keys(this.productModel.schema.obj);

        searchFilter.$or = userFields
          .map((field) => {
            const fieldType = this.productModel.schema.obj[field]?.type;
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

      const totalCount = await this.productModel.countDocuments(searchFilter);

      const data = await this.productModel
        .find(searchFilter)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      if (!data || data.length === 0) {
        return {
          data: [],
          success: true,
          code: HttpStatus.OK,
          message: 'Products Not Found',
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
        message: 'All Products Found',
        limit: filters.limit,
        page: filters.page,
        search: filters.search,
      };
    } catch (ex) {
      throw ex;
    }
  }

  async findByProductTypes(
    filters: IPaginationFilter,
    productType?: string,
  ): Promise<BaseResponseTypeDTO> {
    try {
      const searchFilter: any = {};

      // Search across string fields
      if (filters.search) {
        const searchTerm = filters.search.trim();
        const userFields = Object.keys(this.productModel.schema.obj);

        searchFilter.$or = userFields
          .map((field) => {
            const fieldType = this.productModel.schema.obj[field]?.type;
            if (fieldType === String) {
              return {
                [field]: { $regex: searchTerm, $options: 'i' },
              };
            }
            return {};
          })
          .filter((condition) => Object.keys(condition).length > 0);
      }

      // Filter by productType if provided
      if (productType) {
        searchFilter.productType = productType;
      }

      if (filters.category) {
        searchFilter.category = filters.category;
      }

      const limit = filters.limit || 100;
      const page = filters.page || 1;
      const skip = (page - 1) * limit;

      const totalCount = await this.productModel.countDocuments(searchFilter);

      const data = await this.productModel
        .find(searchFilter)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      if (!data || data.length === 0) {
        return {
          data: [],
          success: true,
          code: HttpStatus.OK,
          message: 'Products Not Found',
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
        message: 'All Products Found',
        limit,
        page,
        search: filters.search,
      };
    } catch (ex) {
      throw ex;
    }
  }

  async getAProduct(productId: string): Promise<BaseResponseTypeDTO> {
    try {
      const product = await this.productModel.findOne({ _id: productId });

      if (!product) {
        throw new NotFoundException(`Product not found.`);
      }

      return {
        data: product,
        success: true,
        code: HttpStatus.OK,
        message: 'Product Fetched',
      };
    } catch (ex) {
      throw ex;
    }
  }

  async updateProduct(
    productId: string,
    payload: UpdateProductDto,
  ): Promise<BaseResponseTypeDTO> {
    try {
      const record = await this.productModel.findOne({ _id: productId });

      if (!record) {
        throw new NotFoundException(
          `Product not found, therefore cannot be updated.`,
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

      if ('category' in payload) {
        record.category = payload.category;
      }

      if ('productType' in payload) {
        record.productType = payload.productType;
      }

      const updatedProduct = await record.save();

      return {
        data: updatedProduct,
        success: true,
        code: HttpStatus.OK,
        message: 'Product Updated',
      };
    } catch (ex) {
      throw ex;
    }
  }

  async deleteProduct(productId: string): Promise<BaseResponseTypeDTO> {
    try {
      const product = await this.productModel.findOne({ _id: productId });

      if (!product) {
        throw new NotFoundException(`Product not found.`);
      }

      await this.productModel.findByIdAndDelete(productId);

      return {
        success: true,
        code: HttpStatus.OK,
        message: 'Product Deleted',
      };
    } catch (ex) {
      throw ex;
    }
  }
}
