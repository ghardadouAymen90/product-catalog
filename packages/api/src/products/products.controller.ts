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

@ApiTags('Products')
@Controller('api/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

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
    description: 'Successfully retrieved all products',
    type: PaginatedDto<ProductDto>,
  })
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ) {
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 20));
    return this.productsService.findAllWithPagination(pageNum, limitNum);
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
    return this.productsService.getMostAppreciatedProducts(5);
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
    return this.productsService.getLowestRatedProducts(5);
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
