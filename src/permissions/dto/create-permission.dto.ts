import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreatePermissionDto {
  @ApiProperty({ example: 'read:orders' })
  @IsString()
  name!: string; // "Create New User"
  @ApiProperty({ example: 'orders', description: 'Resource Name' })
  @IsString()
  resource!: string; // "USER"
  @ApiProperty({ example: 'read', description: 'Action Name' })
  @IsString()
  action!: string; // "CREATE"
  @ApiProperty({
    example: 'Allows reading orders',
    description: 'Permission Description',
  })
  @IsString()
  @IsOptional()
  description?: string;

  // We can auto-generate the 'code' in the service!
}
