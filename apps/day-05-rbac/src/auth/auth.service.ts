import { User } from '@app/shared';
import { BcryptService } from '@app/shared/bcrypt/bcrypt.service';
import { UsersService } from '../users/users.service';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { Role } from '@day-05-rbac/enum/role.enum';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly bcryptService: BcryptService,
  ) {}

  async register(registerUserDto: RegisterUserDto): Promise<User> {
    const hashedPassword = await this.bcryptService.hash(
      registerUserDto.Password,
    );
    const newUser = {
      Name: registerUserDto.Name,
      Email: registerUserDto.Email,
      Password: hashedPassword,
      Roles: registerUserDto.Roles || [Role.User], // Default to user
    };

    try {
      return await this.usersService.create(newUser as any); // Cast to avoid Id complaint
    } catch (error) {
      this.logger.error(`Failed to register user: ${error.message}`);
      throw error;
    }
  }

  async login(loginUserDto: LoginUserDto): Promise<{ token: string }> {
    const user = await this.usersService.findByEmail(loginUserDto.Email);
    if (!user) {
      this.logger.warn(
        `Login failed: User with email ${loginUserDto.Email} not found`,
      );
      throw new UnauthorizedException('Invalid credentials');
    }
    const isPasswordValid = await this.bcryptService.compare(
      loginUserDto.Password,
      user.Password,
    );
    if (!isPasswordValid) {
      this.logger.warn(
        `Login failed: Invalid password for ${loginUserDto.Email}`,
      );
      throw new UnauthorizedException('Invalid credentials');
    }
    this.logger.log(`User ${loginUserDto.Email} logged in successfully`);
    return { token: `mock-jwt-${user.Id}` };
  }
}
