import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../../../day-01-users-module/src/users/users.service';
import { BcryptService } from './bcrypt.service';
import { UsersRepository } from '../../../day-01-users-module/src/users/users.repository';

@Module({
  controllers: [AuthController],
  providers: [AuthService, BcryptService, UsersService, UsersRepository],
})
export class AuthModule {}
