import { CreateUserDto } from '@day-01-users/users/dto/create-user.dto';
import { UsersService } from '@day-01-users/users/users.service';
import { AuthGuard } from '@day-04-auth-guards/guard/auth.guard';
import { Controller, Get, Logger, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
@UseGuards(AuthGuard)
@ApiBearerAuth('JWT')
export class ProtectedUsersController {
  private readonly logger = new Logger(ProtectedUsersController.name);

  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'List of all users',
    type: [CreateUserDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get()
  findAll() {
    this.logger.log('Fetching all users');
    return this.usersService.findAll();
  }

  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiResponse({ status: 200, description: 'User found', type: CreateUserDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    this.logger.log(`Fetching user with ID ${id}`);
    return this.usersService.findOne(id);
  }
}
