import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // By extending AuthGuard('jwt'), NestJS automatically
  // looks for the 'JwtStrategy' to validate the token.
}
