import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { User } from '../rbac/interfaces/user.interface';

@Injectable()
export class UsersRepository {
  private users: Map<string, User> = new Map();
  private emailIndex: Map<string, string> = new Map();

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

  findByEmail(email: string): User | undefined {
    const userId = this.emailIndex.get(email);
    if (!userId) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return this.users.get(userId);
  }

  create(user: User): User {
    this.users.set(user.Id, user);
    this.emailIndex.set(user.Email, user.Id);
    console.log('user????:', user);
    return user;
  }

  update(id: string, user: Partial<User>): User {
    const existingUser = this.findOne(id);
    if (user.Email && user.Email !== existingUser.Email) {
      this.emailIndex.delete(existingUser.Email);
      this.emailIndex.set(user.Email, id);
    }
    const updatedUser = { ...existingUser, ...user };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  delete(id: string): void {
    const user = this.findOne(id);
    this.users.delete(id);
    this.emailIndex.delete(user.Email);
  }
}
