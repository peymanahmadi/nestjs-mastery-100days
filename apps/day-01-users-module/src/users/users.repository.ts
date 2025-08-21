import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { User } from './interface/user.interface';

@Injectable()
export class UsersRepository {
  private users: Map<string, User> = new Map();

  findAll(): User[] {
    return Array.from(this.users.values());
  }

  findOne(id: string): User {
    const user = this.users.get(id);
    if (!user) {
      throw new NotFoundException(`User with Id ${id} not found.`);
    }
    return user;
  }

  create(user: User): User {
    this.users.set(user.Id, user);
    return user;
  }

  update(id: string, user: Partial<User>): User {
    const existingUser = this.findOne(id); // Throw
    const updatedUser = { ...existingUser, ...user };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  delete(id: string) {
    this.findOne(id); // Throws NotFoundException if not found
    this.users.delete(id);
  }
}
