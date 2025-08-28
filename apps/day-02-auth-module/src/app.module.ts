import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from '../../day-01-users-module/src/users/users.module';

@Module({
    imports: [AuthModule, UsersModule]
})
export class AppModule {}
