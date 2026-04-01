import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class BaseUser {
  @ApiProperty({ example: 'john_doe' })
  @IsString()
  @IsNotEmpty()
  username: string;
  @ApiProperty({ example: 'johndoe@gmail.com' })
  @IsEmail()
  email: string;
  @ApiProperty({ example: 'dwew234wd!fvr' })
  @IsString()
  refreshToken: string;
  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(8)
  password: string;
  @IsString()
  roleId: string;
}
