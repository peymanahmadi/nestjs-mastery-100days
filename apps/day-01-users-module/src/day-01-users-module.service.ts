import { Injectable } from '@nestjs/common';

@Injectable()
export class Day01UsersModuleService {
  getHello(): string {
    return 'Hello World!';
  }
}
