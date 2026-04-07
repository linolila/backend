import {
  Controller,
  // Get,
  Post,
  Body,
  Get,
  Query,
  Param,
  Patch,
  Delete,
  // Patch,
  // Param,
  // Delete,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { FilterRoleDto } from './dto/filter-role-dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('role')
@ApiBearerAuth('JWT-auth')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @Get()
  findAll(@Query() FilterRoleDto: FilterRoleDto) {
    return this.roleService.findAll(FilterRoleDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: CreateRoleDto) {
    return this.roleService.updateRole(id, updateRoleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roleService.deleteRole(id);
  }
}
