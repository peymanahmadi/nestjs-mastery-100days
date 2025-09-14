import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from '@day-03-observability/observability/logging.interceptor';
import { CorrelationIdMiddleware } from '@day-03-observability/observability/correlation-id.middleware';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  app.useGlobalInterceptors(new LoggingInterceptor());
  app.use(
    new CorrelationIdMiddleware().use.bind(new CorrelationIdMiddleware()),
  );

  const config = new DocumentBuilder()
    .setTitle('NestJS Auth Guards API')
    .setDescription(
      'API with authentication guards. Use POST /auth/login to obtain a token and include it as "Bearer <token>" in the Authorization header for protected routes.',
    )
    .setVersion('1.0')
    .addTag('auth')
    .addTag('users')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter "mock-jwt-<userId>" from POST /auth/login',
      },
      'JWT',
    )
    .addApiKey(
      { type: 'apiKey', name: 'X-Correlation-Id', in: 'header' },
      'CorrelationId',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.port || 3000;
  await app.listen(port);
  logger.log(`Application listening on port ${port}`);
}
bootstrap();
