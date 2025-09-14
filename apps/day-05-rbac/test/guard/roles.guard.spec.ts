import { Roles, ROLES_KEY } from '@day-05-rbac/decorator/roles.decorator';
import { Role } from '@day-05-rbac/enum/role.enum';
import { RolesGuard } from '@day-05-rbac/guard/roles.guard';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  const mockReflector = {
    getAllAndOverride: jest.fn(),
  };

  const mockRequest = (user: any) => ({
    user,
  });

  const mockContext = (user: any, handlerRoles?: Role[], classRoles?: Role[]) =>
    ({
      getHandler: () => ({}),
      getClass: () => ({}),
      switchToHttp: () => ({
        getRequest: () => ({}),
      }),
    }) as ExecutionContext;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RolesGuard, { provide: Reflector, useValue: mockReflector }],
    }).compile();

    guard = module.get<RolesGuard>(RolesGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should allow access if no roles required', async () => {
    mockReflector.getAllAndOverride.mockReturnValue(undefined);
    const context = mockContext({ Roles: [Role.Admin] });
    const result = guard.canActivate(context);
    expect(result).toBe(true);
    expect(mockReflector.getAllAndOverride).toHaveBeenCalledWith(ROLES_KEY, [
      expect.any(Object),
      expect.any(Object),
    ]);
  });

  it('should allow access if user has required role', async () => {
    mockReflector.getAllAndOverride.mockReturnValue([Role.Admin]);
    const context = mockContext({ Roles: [Role.Admin] });
    const result = guard.canActivate(context);
    expect(result).toBe(true);
  });

  it('should deny access if user lacks required role', async () => {
    mockReflector.getAllAndOverride.mockReturnValue([Role.Admin]);
    const context = mockContext({ Roles: [Role.User] });
    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });

  it('should deny access if user has no roles array', async () => {
    mockReflector.getAllAndOverride.mockReturnValue([Role.Admin]);
    const context = mockContext({ Roles: undefined });
    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });

  it('should deny access if no user in request', async () => {
    mockReflector.getAllAndOverride.mockReturnValue([Role.Admin]);
    const context = mockContext(undefined);
    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });

  it('should allow access with multiple required roles if user has one', async () => {
    mockReflector.getAllAndOverride.mockReturnValue([Role.Admin, Role.User]);
    const context = mockContext({ Roles: [Role.User] });
    const result = guard.canActivate(context);
    expect(result).toBe(true);
  });
});
