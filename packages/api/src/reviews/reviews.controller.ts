import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { ReviewDto } from '../common/dtos/review.dto';
import { PaginatedDto } from '../common/dtos/paginated.dto';

@ApiTags('Reviews')
@Controller('api/reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all reviews',
    description:
      'Retrieve a paginated list of all reviews with their associated products and authors',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (1-indexed)',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page',
    example: 20,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all reviews',
    type: PaginatedDto<ReviewDto>,
  })
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ) {
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 20));
    return this.reviewsService.findAllWithPagination(pageNum, limitNum);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get review by ID',
    description: 'Retrieve a specific review with its product and author information',
  })
  @ApiParam({
    name: 'id',
    description: 'Review ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved review',
    type: ReviewDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Review not found',
  })
  async findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(parseInt(id));
  }

  @Get('product/:productId')
  @ApiOperation({
    summary: 'Get reviews by product ID',
    description: 'Retrieve all reviews for a specific product with pagination',
  })
  @ApiParam({
    name: 'productId',
    description: 'Product ID',
    example: 1,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (1-indexed)',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page',
    example: 20,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved product reviews',
    type: PaginatedDto<ReviewDto>,
  })
  async findByProduct(
    @Param('productId') productId: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ) {
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 20));
    return this.reviewsService.findByProduct(parseInt(productId), pageNum, limitNum);
  }

  @Get('author/:authorId')
  @ApiOperation({
    summary: 'Get reviews by author ID',
    description: 'Retrieve all reviews written by a specific author with pagination',
  })
  @ApiParam({
    name: 'authorId',
    description: 'Author ID',
    example: 1,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (1-indexed)',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page',
    example: 20,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved author reviews',
    type: PaginatedDto<ReviewDto>,
  })
  async findByAuthor(
    @Param('authorId') authorId: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ) {
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 20));
    return this.reviewsService.findByAuthor(parseInt(authorId), pageNum, limitNum);
  }

  @Get('rating/:notation')
  @ApiOperation({
    summary: 'Get reviews by rating',
    description: 'Retrieve all reviews with a specific rating (1-5) with pagination',
  })
  @ApiParam({
    name: 'notation',
    description: 'Rating (1-5)',
    example: 5,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (1-indexed)',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page',
    example: 20,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved reviews by rating',
    type: PaginatedDto<ReviewDto>,
  })
  async findByNotation(
    @Param('notation') notation: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ) {
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 20));
    return this.reviewsService.findByNotation(parseInt(notation), pageNum, limitNum);
  }
}
