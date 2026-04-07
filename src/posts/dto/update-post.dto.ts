import { PartialType } from '@nestjs/swagger';
import { CreateCakeDto } from './create-post.dto';
export class UpdatePostDto extends PartialType(CreateCakeDto) {}
