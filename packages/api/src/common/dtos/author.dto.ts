import { ApiProperty } from '@nestjs/swagger';

export class AuthorDto {
  @ApiProperty({
    description: 'Unique identifier of the author',
    example: 1,
  })
  id!: number;

  @ApiProperty({
    description: 'First name of the author',
    example: 'John',
  })
  firstName!: string;

  @ApiProperty({
    description: 'Last name of the author',
    example: 'Doe',
  })
  lastName!: string;

  @ApiProperty({
    description: 'Type of author (professional or amateur)',
    example: 'professional',
    enum: ['professional', 'amateur'],
  })
  type!: string;

  @ApiProperty({
    description: 'When the author was created',
    example: '2026-03-22T12:00:00Z',
  })
  createdAt!: Date;
}
