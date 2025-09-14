import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MaxLength, MinLength } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({ type: String, description: 'Email of the user' })
  @IsEmail()
  Email: string;

  @ApiProperty({ type: String, description: 'Password of the user' })
  @MinLength(6)
  @MaxLength(32)
  Password: string;
}
