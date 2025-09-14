import { Role } from '@day-05-rbac/enum/role.enum';
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  Name: string;

  @IsEmail()
  Email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(32)
  Password: string;

  @IsArray()
  @IsEnum(Role, { each: true })
  Roles: Role[];
}
