import { Controller, Get } from '@nestjs/common';
import { Day01UsersModuleService } from './day-01-users-module.service';

@Controller()
export class Day01UsersModuleController {
  constructor(private readonly day01UsersModuleService: Day01UsersModuleService) {}

  @Get()
  getHello(): string {
    return this.day01UsersModuleService.getHello();
  }
}
