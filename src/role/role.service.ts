import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
// import { UpdateRoleDto } from './dto/update-role.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '../../generated/prisma/client/client';
import { uuidv7 } from 'uuidv7';
import { FilterRoleDto } from './dto/filter-role-dto';
@Injectable()
export class RoleService {
  constructor(private prisma: PrismaService) {}
  async create(
    createRoleDto: CreateRoleDto,
  ): Promise<{ role: Role; message: string }> {
    // const { name, code, type } = createRoleDto;
    const role = await this.prisma.role.create({
      data: {
        id: uuidv7(),
        name: createRoleDto.name,
        code: createRoleDto.code,
        type: createRoleDto.type,
        description: createRoleDto.description,
        permissions: {
          createMany: {
            data: createRoleDto.permissions.map((pId) => ({
              permissionId: pId,
            })),
          },
        },
      },
    });
    return {
      role,
      message: 'Role created successfully',
    };
  }

  findAll(filterRoleDto: FilterRoleDto): Promise<Role[]> {
    return this.prisma.role.findMany({
      where: {
        name: filterRoleDto.name
          ? { contains: filterRoleDto.name, mode: 'insensitive' }
          : undefined,
        code: filterRoleDto.code
          ? { contains: filterRoleDto.code, mode: 'insensitive' }
          : undefined,
        type: filterRoleDto.type ?? undefined,
      },
    });
  }
  findOne(id: string): Promise<Role | null> {
    return this.prisma.role.findUnique({
      where: { id },
    });
  }
  updateRole(id: string, updateRoleDto: CreateRoleDto): Promise<Role> {
    return this.prisma.role.update({
      where: { id },
      data: {
        name: updateRoleDto.name,
        code: updateRoleDto.code,
        type: updateRoleDto.type,
        description: updateRoleDto.description,
        permissions: {
          update: updateRoleDto.permissions.map((pId) => ({
            where: { roleId_permissionId: { roleId: id, permissionId: pId } },
            data: { permissionId: pId },
          })),
        },
      },
    });
  }
  async deleteRole(id: string): Promise<{
    message: string;
  }> {
    await this.prisma.role.delete({
      where: { id },
    });
    return {
      message: 'Role deleted successfully',
    };
  }
}
