import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString, MaxLength } from "class-validator";

export class UpdateUserRequestDto {
  @ApiProperty({ example: 'Severus Snape', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(250)
  fullName?: string;

  @ApiProperty({ example: 'test@gmail.com', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: 'bio desc', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(250)
  bio?: string;
}
