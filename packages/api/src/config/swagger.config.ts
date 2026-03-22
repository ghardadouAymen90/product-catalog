import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Product Catalog API')
    .setDescription(
      'A comprehensive API for managing products, reviews, and authors in the product catalog system. This API follows REST principles and is designed for high performance and ease of use.',
    )
    .setVersion('1.0.0')
    .addTag('Products', 'Operations related to products')
    .addTag('Reviews', 'Operations related to product reviews')
    .addTag('Authors', 'Operations related to review authors')
    .addTag('Statistics', 'API statistics and KPI endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayOperationId: true,
      tryItOutEnabled: true,
    },
    customCss: `.topbar { display: none; } .swagger-ui { padding: 20px; }`,
    customSiteTitle: 'Product Catalog API Docs',
  });
}
