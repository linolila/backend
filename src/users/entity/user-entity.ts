import { ApiProperty } from '@nestjs/swagger';
import { User } from 'g../../../generated/prisma/client/client';

export class Users implements Partial<User> {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ required: false, nullable: true })
  username: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
