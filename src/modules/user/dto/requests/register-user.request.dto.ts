import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsNotEmpty, IsString, MaxLength } from "class-validator";
import { Gender } from "src/enums/gender.enum";

export class RegisterRequestDto {
    @ApiProperty({ example: 'Severus Snape' })
    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    fullName: string;

    @ApiProperty({ example: 'test@gmail.com' })
    @IsNotEmpty()
    @IsEmail()
    @MaxLength(50)
    email: string;

    @ApiProperty({ example: 'password' })
    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    password: string;

    @ApiProperty({ example: 'male' })
    @IsNotEmpty()
    @IsEnum(Gender)
    gender: string;
}
