import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User } from './interface/user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly usersRepository: UsersRepository) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.findAll();
  }

  async findOne(id: string): Promise<User> {
    return this.usersRepository.findOne(id);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.usersRepository.findOne(createUserDto.Id);
    if (existingUser) {
      this.logger.error(`User with Id ${createUserDto.Id} already exists.`);
      throw new ConflictException(
        `User with Id ${createUserDto.Id} already exists.`,
      );
    }

    const existingEmail = await this.usersRepository
      .findAll()
      .find((user) => user.Email === createUserDto.Email);
    if (existingEmail) {
      this.logger.error(
        `User with email ${createUserDto.Email} already exists.`,
      );
      throw new ConflictException(
        `User with email ${createUserDto.Email} already exists.`,
      );
    }

    const user: User = { ...createUserDto };
    this.logger.log(`Created user with ID ${user.Id}`);
    return this.usersRepository.create(createUserDto);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    return this.usersRepository.update(id, updateUserDto);
  }

  async delete(id: string): Promise<void> {
    return this.usersRepository.delete(id);
  }
}
