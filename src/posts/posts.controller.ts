import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreateCakeDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RequirePermissions } from '../auth/decorators/permission-decorator';
import { JwtAuthGuard } from '../auth/guards/auth/auth-guard';
import { PermissionsGuard } from '../auth/guards/permissions./permissions..guard';

@Controller('cakes')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}
  @Post()
  @RequirePermissions('posts_create')
  create(@Body() createPostDto: CreateCakeDto) {
    return this.postsService.create(createPostDto);
  }

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(id, updatePostDto);
  }

  @Delete()
  remove(@Body() body: { ids: string[] }) {
    return this.postsService.remove(body.ids);
  }
}
