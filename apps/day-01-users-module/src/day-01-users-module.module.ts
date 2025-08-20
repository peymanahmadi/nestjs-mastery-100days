import { Module } from '@nestjs/common';
import { Day01UsersModuleController } from './day-01-users-module.controller';
import { Day01UsersModuleService } from './day-01-users-module.service';

@Module({
  imports: [],
  controllers: [Day01UsersModuleController],
  providers: [Day01UsersModuleService],
})
export class Day01UsersModuleModule {}
