import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { setupSwagger } from './config/swagger.config';

async function bootstrap(): Promise<void> {
  const logger = new Logger();

  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Removes the extra field
      forbidNonWhitelisted: true, //  Rejects with error (extra field)
      transform: true, // Converts "123" to 123
    }),
  );

  app.enableCors();
  setupSwagger(app);

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  logger.log(`✓ Application running on: http://localhost:${port}`);
  logger.log(`✓ API docs available at: http://localhost:${port}/api/docs`);
}

bootstrap().catch((error) => {
  console.error('✗ Failed to start application:', error);
  process.exit(1);
});
