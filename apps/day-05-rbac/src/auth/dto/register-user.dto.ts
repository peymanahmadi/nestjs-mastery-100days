import { Role } from "@day-05-rbac/enum/role.enum";
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from "class-validator";

export class RegisterUserDto {
  @ApiProperty({ type: String, description: 'Name of the user' })
  @IsString()
  Name: string;

  @ApiProperty({ type: String, description: 'Email of the user' })
  @IsEmail()
  Email: string;

  @ApiProperty({ type: String, description: 'Password of the user' })
  @IsString()
  @MinLength(8)
  Password: string;

  @ApiProperty({
    type: [String],
    enum: Role,
    description: 'Roles of the user',
    default: [Role.User],
  })
  @IsEnum(Role, { each: true })
  @IsOptional()
  Roles?: Role[];
}