import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { StatisticsService } from './statistics.service';

@ApiTags('Statistics')
@Controller('api/statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('kpi')
  @ApiOperation({
    summary: 'Get KPI summary',
    description: 'Retrieve key performance indicators (total products, reviews, authors)',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved KPI data',
    schema: {
      example: {
        totalProducts: 250,
        totalReviews: 766,
        totalAuthors: 766,
      },
    },
  })
  async getKPIs() {
    return this.statisticsService.getKPIs();
  }
}
