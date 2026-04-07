import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsUrl, Min, Max } from 'class-validator';

export class CreateCakeDto {
  @ApiProperty({ example: 'Chocolate Fudge' })
  @IsString()
  name!: string;

  @ApiProperty({ example: 'Rich dark chocolate with ganache' })
  @IsString()
  description!: string;

  @ApiProperty({ example: 25.5 })
  @IsNumber()
  @Min(0)
  price!: number;

  @ApiProperty({ example: 'https://images.com/cake.jpg' })
  @IsUrl()
  imageUrl!: string;

  @ApiProperty({ example: 'Dessert' })
  @IsString()
  category!: string;

  @ApiProperty({ example: 4.5 })
  @IsNumber()
  @Min(0)
  @Max(5)
  rating!: number;

  @ApiProperty({ example: ['Flour', 'Cocoa', 'Eggs', 'Sugar'] })
  @IsString({ each: true })
  ingredients!: string[];
  @ApiProperty({ example: 'provider-id-123' })
  @IsString()
  provider!: string;
}
