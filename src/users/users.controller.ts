import {
  Controller,
  Get,
  Post,
  Body,
  // Patch,
  Param,
  Query,
  Patch,
  Delete,
  // UseGuards,
  // Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

// import { UserResponseDto } from './dto/user-response.dto';
import { UserFilterDto } from './dto/user-filter.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '../../generated/prisma/client/client';
// import { Public } from '../auth/decorators/public.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
// import { JwtAuthGuard } from '../auth/guards/auth-guard';
// import { ApiBearerAuth } from '@nestjs/swagger';
// @ApiBearerAuth('JWT-auth')
// @UseGuards(JwtAuthGuard)
@Controller('users')
@ApiBearerAuth('JWT-auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(@Query() userfilterdto: UserFilterDto): Promise<User[]> {
    return this.usersService.findAll(userfilterdto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
