import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class GetMessagesDto {    
    @ApiProperty({ example: '5f9d4f8a4f6ded2b3c6c9b9d' })
    @IsString()
    @MaxLength(50)
    @IsNotEmpty()
    to: string;

    @ApiProperty({ example: 1 })
    page: number;

    @ApiProperty({ example: 10 })
    pageSize: number;
}