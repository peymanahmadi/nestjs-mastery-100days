import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class RegisterUserDto {
  @ApiProperty({ type: String, description: 'Name of the user' })
  @IsString()
  Name: string;

  @ApiProperty({ type: String, description: 'Email of the user' })
  @IsEmail()
  Email: string;

  @ApiProperty({ type: String, description: 'Password of the user' })
  @MinLength(8)
  @MaxLength(32)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  })
  Password: string;
}
