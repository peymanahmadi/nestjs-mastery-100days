import { NestFactory } from '@nestjs/core';
import { Day01UsersModuleModule } from './day-01-users-module.module';

async function bootstrap() {
  const app = await NestFactory.create(Day01UsersModuleModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
