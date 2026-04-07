import { ApiProperty } from '@nestjs/swagger';
import { RoleType } from '../../../generated/prisma/client/enums';
import { IsArray, IsOptional, IsString } from 'class-validator';
export class CreateRoleDto {
  @ApiProperty({ example: 'Admin', description: 'Role Name' })
  @IsString()
  name!: string;
  @ApiProperty({ example: 'ADMIN', description: 'Role Code' })
  @IsString()
  code!: string;
  @ApiProperty({ example: 'ADMIN', description: 'Role Type' })
  @IsString()
  type!: RoleType;
  @ApiProperty({
    example: 'This is the admin role',
    description: 'Role Description',
  })
  @IsString()
  @IsOptional()
  description?: string;
  @IsArray()
  @IsString({ each: true })
  permissions!: string[];
}
