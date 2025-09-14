import { UsersService } from './users.service';
import { AuthGuard } from '../guard/auth.guard';
import { RolesGuard } from '../guard/roles.guard';
import {
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '@day-05-rbac/decorator/roles.decorator';
import { Role } from '@day-05-rbac/enum/role.enum';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';

@ApiTags('users')
@Controller('users')
@UseGuards(AuthGuard)
@ApiBearerAuth('JWT')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Get all users (authenticated users only)' })
  @ApiResponse({
    status: 202,
    description: 'List of all users',
    type: [CreateUserDto],
  })
  @Get()
  getAllUsers() {
    this.logger.log('Fetching all users');
    return this.usersService.findAll();
  }

  @ApiOperation({summary: 'Delete a user (admin only)'})
  @ApiResponse({status: 204, description: 'User deleted'})
  @ApiResponse({status: 403, description: 'Forbidden (non-admin)'})
  @UseGuards(RolesGuard) // Additional role guard for DELETE
  @Roles(Role.Admin)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}
