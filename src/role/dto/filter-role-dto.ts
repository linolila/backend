import { IsOptional } from 'class-validator';
import { RoleType } from '../../../generated/prisma/client/enums';
import { ApiProperty } from '@nestjs/swagger';
export class FilterRoleDto {
  @ApiProperty({ example: 'Admin', description: 'Role Name', required: false })
  @IsOptional()
  name?: string;
  @ApiProperty({ example: 'ADMIN', description: 'Role Code', required: false })
  @IsOptional()
  code?: string;
  @ApiProperty({ example: 'ADMIN', description: 'Role Type', required: false })
  @IsOptional()
  type?: RoleType;
}
