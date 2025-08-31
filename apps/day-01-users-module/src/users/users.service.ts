import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User } from './interface/user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  private readonly instanceId = Math.random().toString(36).substring(7); // Unique ID per instance
  constructor(private readonly usersRepository: UsersRepository) {
    console.log(`UsersService instance created: ${this.instanceId}`);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.findAll();
  }

  async findOne(id: string): Promise<User | null> {
    return this.usersRepository.findOne(id);
  }

  // async findByEmail(email: string): Promise<User | null> {
  //   return this.usersRepository.findByEmail(email);
  // }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findByEmail(email);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const userId = uuidv4();

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

    const user: User = { Id: userId, ...createUserDto };
    this.logger.log(`Created user with Id ${user.Id}`);
    return this.usersRepository.create(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    return this.usersRepository.update(id, updateUserDto);
  }

  async delete(id: string): Promise<void> {
    return this.usersRepository.delete(id);
  }
}
