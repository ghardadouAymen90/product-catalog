import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { ProductDto, ProductDetailDto } from '../common/dtos/product.dto';
import { PaginatedDto } from '../common/dtos/paginated.dto';
import { PaginationHelper } from '../common/utils/pagination.helper';
import { PAGINATION } from 'src/common/constants/pagination.constants';
import { MOST_APPRECIATED } from 'src/common/constants/mostAppreciated.constants';

@ApiTags('Products')
@Controller('api/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Get()
  @ApiOperation({
    summary: 'Get all products',
    description:
      'Retrieve a paginated list of all products with their reviews and authors',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (1-indexed)',
    example: PAGINATION.DEFAULT_PAGE,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page',
    example: PAGINATION.DEFAULT_LIMIT,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all products',
    type: PaginatedDto<ProductDto>,
  })
  async findAll(
    @Query('page') page: string = String(PAGINATION.DEFAULT_PAGE),
    @Query('limit') limit: string = String(PAGINATION.DEFAULT_LIMIT),
  ) {
    const { page: validPage, limit: validLimit } = PaginationHelper.validateAndNormalize(page, limit);
    return this.productsService.findAllWithPagination(validPage, validLimit);
  }

  @Get('appreciated/top')
  @ApiOperation({
    summary: 'Get most appreciated products',
    description:
      'Retrieve the top 5 products with the highest number of positive reviews (notation > 3)',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved most appreciated products',
    type: [ProductDetailDto],
  })
  async getMostAppreciated() {
    return this.productsService.getMostAppreciatedProducts(MOST_APPRECIATED.DEFAULT_LIMIT);
  }

  @Get('lowest-rated')
  @ApiOperation({
    summary: 'Get lowest-rated products',
    description:
      'Retrieve the top 5 products with the lowest average review ratings (average notation < 3)',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved lowest-rated products',
    type: [ProductDetailDto],
  })
  async getLowestRated() {
    return this.productsService.getLowestRatedProducts(MOST_APPRECIATED.DEFAULT_LIMIT);
  }

  @Get('by-reference/:reference')
  @ApiOperation({
    summary: 'Get product by reference',
    description: 'Retrieve a specific product by its unique reference number',
  })
  @ApiParam({
    name: 'reference',
    description: 'Product reference number',
    example: '59033201',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved product',
    type: ProductDetailDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
  })
  async findByReference(@Param('reference') reference: string) {
    return this.productsService.findByReference(reference);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get product by ID',
    description: 'Retrieve a specific product by its ID with all reviews',
  })
  @ApiParam({
    name: 'id',
    description: 'Product ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved product',
    type: ProductDetailDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
  })
  async findOne(@Param('id') id: string) {
    return this.productsService.findOne(parseInt(id));
  }
}
