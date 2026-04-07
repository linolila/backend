import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
type PermissionCode = string;

interface JwtPayload {
  sub: string;
  email: string;
  roleId?: string;
  permissions?: PermissionCode[];
  roleType?: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      // 1. Tell it where to find the token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // 2. Use your secret from the .env file
      secretOrKey: configService.get<string>('JWT_SECRET') || 'default_secret',
    });
  }

  // 3. If the token is valid, this function runs
  validate(payload: JwtPayload) {
    // Whatever you return here becomes 'req.user' in your controllers
    return {
      userId: payload.sub,
      email: payload.email,
      roleId: payload.roleId,
      permissions: payload.permissions,
    };
  }
}
