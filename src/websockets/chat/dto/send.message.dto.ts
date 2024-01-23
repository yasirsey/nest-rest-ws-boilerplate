import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class SendMessageDto {
    @ApiProperty({ example: '5f9d4f8a4f6ded2b3c6c9b9d' })
    @IsString()
    @MaxLength(50)
    @IsNotEmpty()
    to: string;

    @ApiProperty({ example: 'Hello world!' })
    @IsString()
    @MaxLength(500)
    @IsNotEmpty()
    message: string;
}
