import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class RegisterAdminDto {
  @ApiProperty({ example: 'Joe' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'joedoe@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'passworD@123' })
  @IsString()
  password: string;
}

export class LoginDto {
  @ApiProperty({ example: 'joedoe@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'passworD@123' })
  @IsString()
  password: string;
}
