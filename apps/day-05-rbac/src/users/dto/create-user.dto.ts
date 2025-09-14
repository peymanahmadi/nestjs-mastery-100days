import { Role } from '@day-05-rbac/enum/role.enum';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ type: String, description: 'Name of the user' })
  @IsString()
  Name: string;

  @ApiProperty({ type: String, description: 'Email of the user' })
  @IsEmail()
  Email: string;

  @ApiProperty({ type: String, description: 'Password of the user' })
  @IsString()
  @ValidateIf((o) => o.Password) // Optional if not registering
  Password: string;

  @ApiProperty({
    type: String,
    description: 'Role of the user',
    default: [Role.User],
  })
  @IsEnum(Role, { each: true })
  @IsOptional()
  Roles?: Role[];
}
