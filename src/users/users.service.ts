import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '../../generated/prisma/client/client';
// import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { uuidv7 } from 'uuidv7';
import { UserFilterDto } from './dto/user-filter.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export interface userUpdatedResponse {
  email: string;
  username: string;
  password: string;
}
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  async create(createUserDto: CreateUserDto): Promise<User> {
    const newId = uuidv7();
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });
    if (existingUser) {
      throw new ConflictException(
        `User with ${existingUser.email} already exists`,
      );
    }
    const newUser = await this.prisma.user.create({
      data: {
        id: newId,
        username: createUserDto.username,
        email: createUserDto.email,
        refreshToken: createUserDto.refreshToken,
        password: createUserDto.password,
        role: {
          connect: { id: createUserDto.roleId },
        },
      },
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });
    return newUser;
  }
  async findAll(filterDto: UserFilterDto): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      where: {
        // Only filter if the value was provided
        username: filterDto.username
          ? { contains: filterDto.username, mode: 'insensitive' }
          : undefined,
        email: filterDto.email
          ? { contains: filterDto.email, mode: 'insensitive' }
          : undefined,
      },

      select: {
        id: true,
        email: true,
        isActive: true,
        username: true,
        password: true,
        roleId: true,
        refreshToken: true,
      },
    });
    return users;
  }
  findOne(id: string): Promise<User | null> {
    const user = this.prisma.user.findUnique({ where: { id } });
    return user;
  }
  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email }, // This tells Prisma to look in the 'email' column
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });
  }
  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<{ message: string; user: userUpdatedResponse }> {
    const findUser = await this.findOne(id);
    if (!findUser) {
      throw new ConflictException(`User with id ${id} does not exist`);
    }
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        username: updateUserDto.username,
        email: updateUserDto.email,
      },
      select: {
        id: true,
        email: true,
        username: true,
        password: true,
      },
    });
    return {
      message: `User with id ${id} has been updated successfully`,
      user: updatedUser,
    };
  }
  async remove(id: string): Promise<{ message: string }> {
    const findUser = await this.findOne(id);
    if (!findUser) {
      throw new ConflictException(`User with id ${id} does not exist`);
    }
    await this.prisma.user.delete({ where: { id } });
    return {
      message: `User with id ${id} has been deleted successfully`,
    };
  }
}
