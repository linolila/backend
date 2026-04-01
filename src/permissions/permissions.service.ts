import { Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PrismaService } from '../prisma/prisma.service';
@Injectable()
export class PermissionsService {
  constructor(private prisma: PrismaService) {}
  create(createPermissionDto: CreatePermissionDto) {
    const { name, resource, action, description } = createPermissionDto;
    // We can auto-generate the 'code' in the service!
    const code = `${resource.toUpperCase()}_${action.toUpperCase()}`;
    return {
      name,
      resource,
      action,
      description,
      code,
    };
  }

  findAll() {
    return this.prisma.permission.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(id: string) {
    return this.prisma.permission.findUnique({
      where: { id },
    });
  }

  update(id: string, updatePermissionDto: UpdatePermissionDto) {
    return this.prisma.permission.update({
      where: { id },
      data: {
        name: updatePermissionDto.name,
        description: updatePermissionDto.description,
        resource: updatePermissionDto.resource,
        action: updatePermissionDto.action,
      },
    });
  }
  remove(id: string) {
    return this.prisma.permission.delete({
      where: { id },
    });
  }
}
