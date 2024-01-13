import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MaxLength } from "class-validator";

export class LoginRequestDto {
    @ApiProperty({ example: 'test@gmail.com' })
    @IsEmail()
    @IsNotEmpty()
    @MaxLength(50)
    email: string;

    @ApiProperty({ example: 'password' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    password: string;
}
