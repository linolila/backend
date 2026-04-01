import { IsOptional, IsString } from 'class-validator';

export class CreatePermissionDto {
  @IsString()
  name: string; // "Create New User"

  @IsString()
  resource: string; // "USER"

  @IsString()
  action: string; // "CREATE"

  @IsString()
  @IsOptional()
  description?: string;

  // We can auto-generate the 'code' in the service!
}
