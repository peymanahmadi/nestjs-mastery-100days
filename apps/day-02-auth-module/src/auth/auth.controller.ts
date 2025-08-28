import {
  Body,
  Controller,
  Logger,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from '../../../day-01-users-module/src/users/interface/user.interface';
import { LoggingInterceptor } from 'apps/day-03-observability/src/observability/logging.interceptor';

@ApiTags('auth')
@UseInterceptors(LoggingInterceptor)
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    this.logger.log(`Registering user with email: ${registerUserDto.Email}`);
    return this.authService.register(registerUserDto);
  }

  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({ status: 200, description: 'User logged in', type: Object })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    this.logger.log(`Logging in user with email: ${loginUserDto.Email}`);
    return this.authService.login(loginUserDto);
  }
}
