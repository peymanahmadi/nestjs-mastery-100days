import { IsEmail, IsString, IsUUID, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {
    @IsUUID()
    Id: string;

    @IsString()
    Name: string;

    @IsEmail()
    Email: string;

    @IsString()
    @MinLength(6)
    @MaxLength(32)
    Password: string;
}