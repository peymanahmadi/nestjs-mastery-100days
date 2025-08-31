import { User } from '@app/shared/interfaces/user.interface';
import { UsersService } from '@day-01-users/users/users.service';
import { AuthGuard } from '@day-04-auth-guards/guard/auth.guard';
import { ExecutionContext } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let usersService: UsersService;

  const mockUser: User = {
    Id: '123',
    Name: 'John Doe',
    Email: 'john@example.com',
    Password: '$2b$10$hashedpassword',
  };

  const mockUsersService = {
    findOne: jest.fn(),
  };

  //   const mockContext = (authHeader?: string) =>
  //     ({
  //       switchToHttp: () => ({
  //         getRequest: () => ({
  //           headers: { authorization: authHeader },
  //         }),
  //       }),
  //     }) as ExecutionContext;

  // Create a mock request object that can be modified
  const createMockContext = (authHeader?: string) => {
    const mockRequest = {
      headers: { authorization: authHeader },
      user: undefined, // This will be set by the guard
    };

    return {
      switchToHttp: () => ({
        getRequest: () => mockRequest, // Return the same object each time
      }),
    } as ExecutionContext;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthGuard,
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    authGuard = module.get<AuthGuard>(AuthGuard);
    usersService = module.get<UsersService>(UsersService);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should allow access with valid token', async () => {
    mockUsersService.findOne.mockResolvedValue(mockUser);

    // Create context and get the mock request reference
    const context = createMockContext('Bearer mock-jwt-123');
    const mockRequest = context.switchToHttp().getRequest(); // Get reference

    const result = await authGuard.canActivate(context);

    expect(result).toBe(true);
    expect(mockUsersService.findOne).toHaveBeenCalledWith('123');
    expect(mockRequest.user).toEqual(mockUser); // Use the reference, not context.getRequest() again
  });

  it('should allow access with valid token', async () => {
    mockUsersService.findOne.mockResolvedValue(mockUser);
    const context = createMockContext('Bearer mock-jwt-123');

    const result = await authGuard.canActivate(context);

    expect(result).toBe(true);
    expect(mockUsersService.findOne).toHaveBeenCalledWith('123');
    expect(context.switchToHttp().getRequest().user).toEqual(mockUser);
  });

  it('should throw UnauthorizedException for missing token', async () => {
    const context = createMockContext();
    await expect(authGuard.canActivate(context)).rejects.toThrow(
      'Invalid or missing token',
    );
  });

  it('should throw UnauthorizedException for invalid token format', async () => {
    const context = createMockContext('Bearer invalid-token');
    await expect(authGuard.canActivate(context)).rejects.toThrow(
      'Invalid token',
    );
  });

  it('should throw UnauthorizedException for non-existent user', async () => {
    mockUsersService.findOne.mockRejectedValue(new Error('User not found'));
    const context = createMockContext('Bearer mock-jwt-999');
    await expect(authGuard.canActivate(context)).rejects.toThrow(
      'Invalid token',
    );
  });
});
