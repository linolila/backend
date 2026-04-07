import { Injectable } from '@nestjs/common';
import { CreateCakeDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { uuidv7 } from 'uuidv7';
import { Cake } from '../../generated/prisma/client/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async create(
    createPostDto: CreateCakeDto,
  ): Promise<{ cake: Cake; message: string }> {
    const existingCake = await this.prisma.cake.findUnique({
      where: { name: createPostDto.name },
    });
    if (existingCake) {
      throw new Error(`Cake with name ${createPostDto.name} already exists`);
    }
    const newcake = await this.prisma.cake.create({
      data: {
        id: uuidv7(),
        name: createPostDto.name,
        description: createPostDto.description,
        price: createPostDto.price,
        imageUrl: createPostDto.imageUrl,
        category: createPostDto.category,
        rating: createPostDto.rating,
        ingredients: createPostDto.ingredients,
        provider: {
          connect: { id: createPostDto.provider },
        },
      },
    });
    return {
      cake: newcake,
      message: 'Cake created successfully',
    };
  }
  findAll() {
    return this.prisma.cake.findMany({
      include: {
        provider: true,
      },
    });
  }

  async findOne(id: string): Promise<Cake | null> {
    return this.prisma.cake.findUnique({
      where: { id },
      include: {
        provider: true,
      },
    });
  }

  async update(
    id: string,
    updatePostDto: UpdatePostDto,
  ): Promise<{ cake: Cake; message: string }> {
    const checkCake = await this.prisma.cake.findUnique({
      where: { id },
    });
    if (!checkCake) {
      throw new Error(`Cake with id ${id} not found`);
    }
    // Prepare update data, handling provider separately
    const { provider, ...updateData } = updatePostDto;

    const data = provider
      ? { ...updateData, provider: { connect: { id: provider } } }
      : updateData;

    const updatedCake = await this.prisma.cake.update({
      where: { id },
      data: data, // Type assertion needed for partial updates with relations
      include: {
        provider: true,
      },
    });
    return {
      cake: updatedCake,
      message: 'Cake updated successfully',
    };
  }

  async remove(ids: string[]): Promise<{ count: number; message: string }> {
    const result = await this.prisma.cake.deleteMany({
      where: { id: { in: ids } },
    });
    return {
      count: result.count,
      message: `${result.count} cakes deleted successfully`,
    };
  }
}
