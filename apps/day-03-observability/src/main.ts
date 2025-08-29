import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './observability/logging.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import { CorrelationIdMiddleware } from './observability/correlation-id.middleware';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  // Global interceptor
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Global middleware
  app.use(
    new CorrelationIdMiddleware().use.bind(new CorrelationIdMiddleware()),
  );

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('NestJS Observability API')
    .setDescription('API with observability features')
    .setVersion('1.0')
    .addTag('auth')
    .addTag('users')
    .addApiKey(
      { type: 'apiKey', name: 'X-Correlation-Id', in: 'header' },
      'CorrelationId',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  logger.log(`Application running on port ${port}`);
}
bootstrap();
