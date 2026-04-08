import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../../decorators/permission-decorator';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService, // Inject Prisma to check DB
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1. Get the permission code from the @RequiredPermission decorator
    const requiredPermission = this.reflector.getAllAndOverride<string>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermission) return true;

    // 2. Get the user from the Request (populated by JwtStrategy)

    // Type-safe extraction of user from request
    const request = context
      .switchToHttp()
      .getRequest<{ user?: { id: string } }>();
    const userId = request.user?.id;

    // 3. INDUSTRY STANDARD: Fetch fresh permissions from the DB

    if (!userId) return false;

    const userWithPermissions = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        role: {
          include: {
            permissions: { include: { permission: true } },
          },
        },
      },
    });

    const userPermissions =
      userWithPermissions?.role.permissions.map((rp) => rp.permission.code) ||
      [];

    // 4. Check if they have the specific permission
    return userPermissions.includes(requiredPermission);
  }
}
