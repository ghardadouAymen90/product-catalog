import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AppDataSource } from './database/data-source';

async function bootstrap() {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log('Database connected successfully');
    }
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }

  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors();

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
    customCss: `
      .topbar { display: none; }
      .swagger-ui { padding: 20px; }
    `,
    customSiteTitle: 'Product Catalog API Docs',
  });

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`API Documentation available at: http://localhost:${port}/api/docs`);
}

bootstrap();
