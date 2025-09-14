import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Role } from '../enum/role.enum';
import { ROLES_KEY } from '../decorator/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    this.logger.log(
      `Required roles: ${requiredRoles ? requiredRoles.join(', ') : 'none'}`,
    );

    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    this.logger.log(`User from request: ${JSON.stringify(user)}`);
    this.logger.log(
      `User roles: ${user?.Roles ? user.Roles.join(', ') : 'undefined'}`,
    );

    // if (!user || !user.Role)
    //   throw new ForbiddenException('User role not found');

    // FIX: Check if user exists and has roles array (even if empty)
    if (!user || !Array.isArray(user.Roles)) {
      this.logger.warn('User or user roles array not found in request');
      throw new ForbiddenException('User role not found');
    }

    // return requiredRoles.some((role) => user.Roles.includes(role));

    const hasRequiredRole = requiredRoles.some((role) =>
      user.Roles.includes(role),
    );
    this.logger.log(`User has required role: ${hasRequiredRole}`);

    return hasRequiredRole;
  }
}
