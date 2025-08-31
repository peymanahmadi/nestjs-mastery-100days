import { UsersModule } from '@day-01-users/users/users.module';
import { Module } from '@nestjs/common';
import { ProtectedUsersController } from './protected-users.controller';

@Module({
  imports: [UsersModule],
  controllers: [ProtectedUsersController],
})
export class ProtectedUsersModule {}
