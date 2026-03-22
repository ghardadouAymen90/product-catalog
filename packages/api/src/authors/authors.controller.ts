import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { AuthorsService } from './authors.service';
import { AuthorDto } from '../common/dtos/author.dto';
import { PaginatedDto } from '../common/dtos/paginated.dto';
import { PaginationHelper } from '../common/utils/pagination.helper';
import { PAGINATION } from '../common/constants/pagination.constants';
import { AUTHORS } from 'src/common/constants/authors.constants';

@ApiTags('Authors')
@Controller('api/authors')
export class AuthorsController {

  constructor(private readonly authorsService: AuthorsService) { }


  @Get()
  @ApiOperation({
    summary: 'Get all authors',
    description: 'Retrieve a paginated list of all authors with their reviews',
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
    description: 'Successfully retrieved all authors',
    type: PaginatedDto<AuthorDto>,
  })
  async findAll(
    @Query('page') page: string = String(PAGINATION.DEFAULT_PAGE),
    @Query('limit') limit: string = String(PAGINATION.DEFAULT_LIMIT),
  ) {
    const { page: validPage, limit: validLimit } = PaginationHelper.validateAndNormalize(page, limit);
    return this.authorsService.findAllWithPagination(validPage, validLimit);
  }


  @Get('top/most-active')
  @ApiOperation({
    summary: 'Get most active authors',
    description:
      'Retrieve the top 10 authors who have written the most reviews',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved most active authors',
    type: [AuthorDto],
  })
  async getMostActive() {
    return this.authorsService.getMostActiveAuthors(AUTHORS.MOST_ACTIVE_LIMIT);
  }



  @Get('type/:type')
  @ApiOperation({
    summary: 'Get authors by type',
    description: 'Retrieve authors filtered by type (professional or amateur)',
  })
  @ApiParam({
    name: 'type',
    description: 'Author type',
    example: 'professional',
    enum: ['professional', 'amateur'],
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
    description: 'Successfully retrieved authors by type',
    type: PaginatedDto<AuthorDto>,
  })
  async findByType(
    @Param('type') type: string,
    @Query('page') page: string = String(PAGINATION.DEFAULT_PAGE),
    @Query('limit') limit: string = String(PAGINATION.DEFAULT_LIMIT),
  ) {
    const { page: validPage, limit: validLimit } = PaginationHelper.validateAndNormalize(page, limit);
    return this.authorsService.findByType(type, validPage, validLimit);
  }




  @Get(':id')
  @ApiOperation({
    summary: 'Get author by ID',
    description: 'Retrieve a specific author with all their reviews and associated products',
  })
  @ApiParam({
    name: 'id',
    description: 'Author ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved author',
    type: AuthorDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Author not found',
  })
  async findOne(@Param('id') id: string) {
    return this.authorsService.findOne(parseInt(id));
  }
}
