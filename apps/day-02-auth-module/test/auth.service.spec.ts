import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../src/auth/auth.service';
import { UsersService } from '../../day-01-users-module/src/users/users.service';
import { BcryptService } from '../src/auth/bcrypt.service';
import { User } from '@app/shared/interfaces/user.interface';
import { RegisterUserDto } from '../src/auth/dto/register-user.dto';
import { LoginUserDto } from '../src/auth/dto/login-user.dto';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let bcryptService: BcryptService;

  const mockUser: User = {
    Id: '123',
    Name: 'John Doe',
    Email: 'john@example.com',
    Password: '$2b$10$hashedpassword',
  };

  const mockUsersService = {
    create: jest.fn(),
    findByEmail: jest.fn(),
  };

  const mockBcryptService = {
    hash: jest.fn(),
    compare: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: BcryptService, useValue: mockBcryptService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    bcryptService = module.get<BcryptService>(BcryptService);
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const registerDto: RegisterUserDto = {
        Name: 'John Doe',
        Email: 'john@example.com',
        Password: 'Password123',
      };
      mockBcryptService.hash.mockResolvedValue('$2b$10$hashedpassword');
      mockUsersService.create.mockResolvedValue(mockUser);

      const result = await authService.register(registerDto);

      expect(mockBcryptService.hash).toHaveBeenCalledWith('Password123');
      expect(mockUsersService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          Id: expect.any(String),
          Name: 'John Doe',
          Email: 'john@example.com',
          Password: '$2b$10$hashedpassword',
        }),
      );
      expect(result).toEqual(mockUser);
    });

    it('should throw ConflictException if email exists', async () => {
      const registerDto: RegisterUserDto = {
        Name: 'John Doe',
        Email: 'john@example.com',
        Password: 'Password123',
      };
      mockUsersService.create.mockRejectedValue(
        new Error('Email already exists'),
      );

      await expect(authService.register(registerDto)).rejects.toThrow(
        'Email already exists',
      );
    });
  });

  describe('login', () => {
    it('should return a JWT token for valid credentials', async () => {
      const loginDto: LoginUserDto = {
        Email: 'john@example.com',
        Password: 'Password123',
      };
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      mockBcryptService.compare.mockResolvedValue(true);

      const result = await authService.login(loginDto);

      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(
        'john@example.com',
      );
      expect(mockBcryptService.compare).toHaveBeenCalledWith(
        'Password123',
        mockUser.Password,
      );
      expect(result).toEqual({ token: `mock-jwt-${mockUser.Id}` });
    });

    it('should throw UnauthorizedException for invalid email', async () => {
      const loginDto: LoginUserDto = {
        Email: 'john@example.com',
        Password: 'Password123',
      };
      mockUsersService.findByEmail.mockRejectedValue(
        new UnauthorizedException('Invalid credentials'),
      );

      await expect(authService.login(loginDto)).rejects.toThrow(
        'Invalid credentials',
      );
    });

    it('should throw UnauthorizedException for invalid password', async () => {
      const loginDto: LoginUserDto = {
        Email: 'john@example.com',
        Password: 'WrongPassword',
      };
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      mockBcryptService.compare.mockResolvedValue(false);

      await expect(authService.login(loginDto)).rejects.toThrow(
        'Invalid credentials',
      );
    });
  });
});
