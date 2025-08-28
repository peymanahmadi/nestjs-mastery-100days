import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiOperation,
  ApiRequestTimeoutResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LoggingInterceptor } from 'apps/day-03-observability/src/observability/logging.interceptor';

@ApiTags('users')
@UseInterceptors(LoggingInterceptor)
@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'List of all users',
    type: [CreateUserDto],
  })
  @Get()
  getAllUsers() {
    this.logger.log('Fetching all users');
    return this.usersService.findAll();
  }

  @ApiOperation({ summary: 'Get a user by Id' })
  @ApiResponse({ status: 200, description: 'User found', type: CreateUserDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Get(':id')
  getOneUser(@Param('id') id: string) {
    this.logger.log(`Fetching user with ID ${id}`);
    return this.usersService.findOne(id);
  }

  @ApiOperation({ summary: 'Get a user by email' })
  @ApiResponse({ status: 200, description: 'User found', type: CreateUserDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Get('email/:email')
  findByEmail(@Param('email') email: string) {
    this.logger.log(`Fetching user with email ${email}`);
    return this.usersService.findByEmail(email);
  }

  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'User created',
    type: CreateUserDto,
  })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    this.logger.log(`Creating user with email ${createUserDto.Email}`);
    return this.usersService.create(createUserDto);
  }

  @ApiOperation({ summary: 'Update an existing user' })
  @ApiResponse({
    status: 200,
    description: 'User updated',
    type: UpdateUserDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Put(':id')
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    this.logger.log(`Updating user with Id ${id}`);
    return this.usersService.update(id, updateUserDto);
  }

  @ApiOperation({ summary: 'Delete a user by Id' })
  @ApiResponse({ status: 204, description: 'User deleted' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    this.logger.log(`Deleting user with Id ${id}`);
    return this.usersService.delete(id);
  }
}
