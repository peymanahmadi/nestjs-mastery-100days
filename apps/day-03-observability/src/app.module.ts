import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CorrelationIdMiddleware } from './observability/correlation-id.middleware';
import { UsersModule } from '@day-01-users/users/users.module';
import { AuthModule } from '@day-02-auth/auth/auth.module';

@Module({
  imports: [AuthModule, UsersModule],
})
export class AppModule {}
