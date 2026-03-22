import { ApiProperty } from '@nestjs/swagger';
import { AuthorDto } from './author.dto';

export class ReviewDto {
  @ApiProperty({
    description: 'Unique identifier of the review',
    example: 1,
  })
  id!: number;

  @ApiProperty({
    description: 'Rating from 1 to 5',
    example: 5,
    minimum: 1,
    maximum: 5,
  })
  notation!: number;

  @ApiProperty({
    description: 'Date when the review was written',
    example: '2025-04-06T02:09:10Z',
  })
  date!: Date;

  @ApiProperty({
    description: 'Review comment text',
    example: 'Very practical and easy to use.',
  })
  comment!: string;

  @ApiProperty({
    description: 'The author who wrote this review',
    type: AuthorDto,
  })
  author!: AuthorDto;

  @ApiProperty({
    description: 'When the review record was created',
    example: '2026-03-22T12:00:00Z',
  })
  createdAt!: Date;
}
