import { ApiProperty } from '@nestjs/swagger';
import { ReviewDto } from './review.dto';

export class ProductDto {
  @ApiProperty({
    description: 'Unique identifier of the product',
    example: 1,
  })
  id!: number;

  @ApiProperty({
    description: 'Unique reference number for the product',
    example: '59033201',
  })
  reference!: string;

  @ApiProperty({
    description: 'Product name',
    example: 'Premium Wireless Headphones',
  })
  name!: string;

  @ApiProperty({
    description: 'Detailed product description',
    example: 'High-quality wireless headphones with noise cancellation...',
  })
  description!: string;

  @ApiProperty({
    description: 'Product price',
    example: 972.5,
  })
  price!: number;

  @ApiProperty({
    description: 'Currency code (ISO 4217)',
    example: 'EUR',
  })
  currency!: string;

  @ApiProperty({
    description: 'Available stock quantity',
    example: 415,
  })
  stock!: number;

  @ApiProperty({
    description: 'When the product was created',
    example: '2026-03-22T12:00:00Z',
  })
  createdAt!: Date;

  @ApiProperty({
    description: 'When the product was last updated',
    example: '2026-03-22T12:00:00Z',
  })
  updatedAt!: Date;

  @ApiProperty({
    description: 'Associated reviews for this product',
    type: [ReviewDto],
  })
  reviews?: ReviewDto[];
}

export class ProductDetailDto extends ProductDto {
  @ApiProperty({
    description: 'Reviews for this product (included in detail view)',
    type: [ReviewDto],
  })
  reviews!: ReviewDto[];
}
