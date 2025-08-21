import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsUUID } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: 'Unique UUID for the user' })
  @IsUUID()
  Id: string;

  @ApiProperty({ type: String, description: 'Name of the user' })
  @IsString()
  Name: string;

  @ApiProperty({ type: String, description: 'Email of the user' })
  @IsEmail()
  Email: string;
}
