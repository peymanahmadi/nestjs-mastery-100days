import { Test, TestingModule } from '@nestjs/testing';
import { Day01UsersModuleController } from './day-01-users-module.controller';
import { Day01UsersModuleService } from './day-01-users-module.service';

describe('Day01UsersModuleController', () => {
  let day01UsersModuleController: Day01UsersModuleController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [Day01UsersModuleController],
      providers: [Day01UsersModuleService],
    }).compile();

    day01UsersModuleController = app.get<Day01UsersModuleController>(Day01UsersModuleController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(day01UsersModuleController.getHello()).toBe('Hello World!');
    });
  });
});
