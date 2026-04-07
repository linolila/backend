/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
import { Body, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
// import { User } from '../../generated/prisma/client';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { User } from '../../generated/prisma/client/client';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    username: string;
    role: {
      id: string;
      name: string;
      code: string;
      type: string;
      permissions: string[];
    };
  };
}
// import { UserResponseDto } from 'src/users/dto/user-response.dto';
export interface Payload {
  sub: string;
  email: string;
}
@Injectable()
export class AuthService {
  // 1. You MUST inject the services here
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private prisma: PrismaService,
    private configservice: ConfigService,
  ) {}
  signUp(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = bcrypt.hashSync(createUserDto.password, 10);
    return this.usersService.create({
      username: createUserDto.username,
      email: createUserDto.email,
      password: hashedPassword,
      roleId: createUserDto.roleId,
      refreshToken: createUserDto.refreshToken,
    });
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ data: LoginResponse; success: boolean }> {
    // 1. Fetch the user
    const user = await this.usersService.findByEmail(email);

    // 2. Safety Check: If user is null, stop here
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 3. Password Check
    const passwordValid = bcrypt.compareSync(password, user.password);
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid password');
    }
    const tokens = await this.getTokens(user.id, user.email);
    // 5. Return mapped data
    return {
      success: true,
      data: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: {
            id: user.role.id,
            name: user.role.name,
            type: user.role.type,
            code: user.role.code, // Fixed: This matches your interface now
            // Mapping the deep Prisma object to a simple string array
            permissions: user.role.permissions.map((rp) => rp.permission.code),
          },
        },
      },
    };
  }
  // this function creats two tokens and returns them with different time line
  async getTokens(
    userId: string,
    email: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email },
        { secret: this.configservice.get('JWT_SECTER'), expiresIn: '1h' },
      ),
      this.jwtService.signAsync(
        { sub: userId, email },
        {
          secret: this.configservice.get('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken: at,
      refreshToken: rt,
    };
  }
  async updateRefreshTokenHash(userId: string, refreshToken: string) {
    const hashRefreshToken = bcrypt.hash(refreshToken, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: await hashRefreshToken },
    });
  }
  async refreshToken(userId: string, token: string) {
    const user = await this.usersService.findOne(userId);
    // first checks if the user exists and refreshtoken actually exists in db
    if (!user || !user.refreshToken)
      return new UnauthorizedException('Access denied: User unauthorized!');
    // then we compare p, idk first , now ik , we comapre the access token sent from the user with what actually stored in the db
    const isMatching = await bcrypt.compare(token, user.refreshToken);
    // if they are the same we are going to refresh the access token using the stored refresh  token
    if (!isMatching) {
      return new UnauthorizedException('Unauthorized : Token expired!!!');
    }
    const payload = {
      sub: user.id,
      email: user.email,
    };
    const tokens = await this.getTokens(payload.sub, payload.email);

    // 5. Update the DB with the NEW refresh token (Rotation)
    await this.updateRefreshTokenHash(user.id, tokens.refreshToken);

    return tokens;
  }
}
