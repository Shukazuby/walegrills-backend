import { IsEmail, IsString } from "class-validator"

export class CreateUserDto {

@IsString()
prefix?:string

@IsString()
name:string

@IsEmail()
email:string

@IsString()
phoneNumber:string
}
