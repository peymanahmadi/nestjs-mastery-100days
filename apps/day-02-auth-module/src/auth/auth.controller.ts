import {
  Body,
  Controller,
  Logger,
  Post,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';

@ApiTags('auth')
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

  @ApiOperation({ summary: 'Login a user and return a mock JWT token' })
  @ApiResponse({
    status: 200,
    description: 'Token returned in body and X-Access-Token header',
    type: Object,
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto, @Res() res: Response) {
    this.logger.log(`Logging in user with email: ${loginUserDto.Email}`);
    const result = await this.authService.login(loginUserDto);
    res.setHeader('X-Access-Token', result.token);
    return res.json(result);
  }
}
