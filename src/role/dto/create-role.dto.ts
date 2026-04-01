import { ApiProperty } from '@nestjs/swagger';
import { RoleType } from '../../../generated/prisma/client/enums';
import { IsArray, IsString } from 'class-validator';
export class CreateRoleDto {
  @ApiProperty({
    example: '019d2f2f-8b1b-7eb8-a37f-55838a724531',
    description: 'Role Id',
  })
  id: string;
  @ApiProperty({ example: 'Admin', description: 'Role Name' })
  name: string;
  @ApiProperty({ example: 'ADMIN', description: 'Role Code' })
  code: string;
  @ApiProperty({ example: 'ADMIN', description: 'Role Type' })
  type: RoleType;
  @ApiProperty({
    example: 'This is the admin role',
    description: 'Role Description',
  })
  description?: string;
  @IsArray()
  @IsString({ each: true })
  permissions: string[];
}
