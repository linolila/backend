import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class BaseUser {
  @ApiProperty({ example: 'john_doe' })
  @IsString()
  @IsNotEmpty()
  username!: string;
  @ApiProperty({ example: 'johndoe@gmail.com' })
  @IsEmail()
  email!: string;
  @ApiProperty({ example: 'dwew234wd!fvr' })
  @IsString()
  @IsOptional()
  refreshToken!: string;
  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(8)
  password!: string;
  @IsString()
  @IsOptional()
  roleId!: string;
}
