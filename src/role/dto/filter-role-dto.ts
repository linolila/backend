import { RoleType } from '../../../generated/prisma/client/enums';
import { ApiProperty } from '@nestjs/swagger';
export class FilterRoleDto {
  @ApiProperty({ example: 'Admin', description: 'Role Name', required: false })
  name?: string;
  @ApiProperty({ example: 'ADMIN', description: 'Role Code', required: false })
  code?: string;
  @ApiProperty({ example: 'ADMIN', description: 'Role Type', required: false })
  type?: RoleType;
}
