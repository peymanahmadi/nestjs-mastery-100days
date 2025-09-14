import { Body, Controller, Logger, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered' })
  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    this.logger.log(`Registering user with email: ${registerUserDto.Email}`);
    return await this.authService.register(registerUserDto);
  }

  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({ status: 200, description: 'Token returned' })
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    this.logger.log(`Logging in user with email: ${loginUserDto.Email}`);
    return await this.authService.login(loginUserDto);
  }
}
