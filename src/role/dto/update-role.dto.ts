import { ApiProperty } from '@nestjs/swagger';
import { RoleType } from '../../../generated/prisma/client/enums';
import { IsArray, IsOptional, IsString } from 'class-validator';
export class UpdateRoleDto {
  @IsOptional()
  name!: string;
  @ApiProperty({ example: 'ADMIN', description: 'Role Code' })
  @IsOptional()
  code!: string;
  @ApiProperty({ example: 'ADMIN', description: 'Role Type' })
  @IsOptional()
  type!: RoleType;
  @ApiProperty({
    example: 'This is the admin role',
    description: 'Role Description',
  })
  description?: string;
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  permissions!: string[];
}
