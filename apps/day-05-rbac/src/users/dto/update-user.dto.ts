import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    type: String,
    description: 'Name of the user',
    required: false,
  })
  @IsOptional()
  @IsString()
  Name?: string;

  @ApiProperty({
    type: String,
    description: 'Email of the user',
    required: false,
  })
  @IsOptional()
  @IsString()
  Email?: string;
}
