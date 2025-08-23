// upload.controller.ts
import {
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { CloudinaryService } from './cloudinary.service';
import { ApiTags } from '@nestjs/swagger';
  
  @ApiTags('Cloudinary Upload')
  @Controller('upload')
  export class UploadController {
    constructor(private readonly cloudinaryService: CloudinaryService) {}
  
    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
      const result = await this.cloudinaryService.uploadFile(file.buffer, 'your-folder-name');
      return {
        message: 'Upload successful',
        url: result.secure_url,
      };
    }
  }
  