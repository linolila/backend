import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // By extending AuthGuard('jwt'), NestJS automatically
  // looks for the 'JwtStrategy' to validate the token.
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);
    // 🔥 SKIP AUTH
    if (isPublic) return true;

    const can = super.canActivate(context) as boolean;
    return can;
  }
}
