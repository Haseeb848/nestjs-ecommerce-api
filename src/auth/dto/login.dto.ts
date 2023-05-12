import { Injectable } from '@nestjs/common';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';

@Injectable()
export class AuthInDto {
  @IsNotEmpty()
  @IsString()
  @IsStrongPassword()
  password: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class ChangeInDto {
  @IsNotEmpty()
  @IsString()
  @IsStrongPassword()
  password: string;
}

export class EditUserDto {
  @IsString()
  @IsOptional()
  firstName: string;

  @IsString()
  @IsOptional()
  lastName: string;
}
