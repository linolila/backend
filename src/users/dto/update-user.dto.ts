import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
export class UpdateUserDto {
  @ApiProperty({ example: 'john_doe' })
  @ApiProperty({ example: '' })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  username: string;
  @ApiProperty({ example: 'johndoe@gmail.com' })
  @IsEmail()
  @IsOptional()
  email: string;
  @ApiProperty({ example: 'dwew234wd!fvr' })
  @IsString()
  @IsOptional()
  refreshToken: string;
  @ApiProperty({ example: 'password123' })
  @IsString()
  @IsOptional()
  @MinLength(8)
  password: string;
  @IsString()
  @IsOptional()
  roleId: string;
}
