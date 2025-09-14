import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { v4 as uuidv4 } from 'uuid';
import { UsersRepository } from './users.repository';
import { User } from './interfaces/user.interface';
import { CreateUserDto } from '@app/shared/rbac/dtos/create-user.dto';
import { Role } from '@day-05-rbac/enum/role.enum';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly usersRepository: UsersRepository) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.findAll();
  }

  async findOne(id: string): Promise<User | null> {
    return this.usersRepository.findOne(id);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findByEmail(email);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Generate Id always
    const userId = uuidv4();

    // Use findByEmail for O(1) check
    const existingEmail = await this.findByEmail(createUserDto.Email);
    if (existingEmail) {
      this.logger.error(
        `User with email ${createUserDto.Email} already exists.`,
      );
      throw new ConflictException(
        `User with email ${createUserDto.Email} already exists.`,
      );
    }

    const user: User = {
      Id: userId,
      Name: createUserDto.Name,
      Email: createUserDto.Email,
      Password: createUserDto.Password,
      Roles: createUserDto.Roles || [Role.User], // Default to user
    };
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
