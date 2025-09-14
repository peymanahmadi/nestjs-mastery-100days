import { UsersService } from '../users/users.service';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(private readonly usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      this.logger.warn('Missing or invalid Authorization header');
      throw new UnauthorizedException('Invalid or missing token');
    }

    const token = authHeader.split(' ')[1];
    if (!token.startsWith('mock-jwt-')) {
      this.logger.warn('Invalid token format');
      throw new UnauthorizedException('Invalid token');
    }

    const userId = token.replace('mock-jwt-', '');
    try {
      const user = await this.usersService.findOne(userId);
      if (!user) {
        this.logger.warn(`User ${userId} not found in database`);
        throw new UnauthorizedException('Invalid token');
      }

      // Sanitize user (exclude password)
      request.user = { ...user, Password: undefined };
      this.logger.log(`User ${userId} authenticated`);
      return true;
    } catch (error) {
      this.logger.warn(`User ${userId} not found`);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
