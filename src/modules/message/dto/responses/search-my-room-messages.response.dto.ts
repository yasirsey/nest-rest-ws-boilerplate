import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';
import { MessageDto } from 'src/schemas/dto/message.dto';

export class SearchMyRoomMessagesResponseDto {
    @ApiProperty({ example: 1 })
    @IsInt()
    total: number;

    @ApiProperty({ example: 1 })
    @IsInt()
    page: number;

    @ApiProperty({ example: 10 })
    @IsInt()
    limit: number;

    @ApiProperty({ type: [MessageDto] })
    messages: MessageDto[];

    constructor(total: number, page: number, limit: number, messages: MessageDto[]) {
        this.total = total;
        this.page = page;
        this.limit = limit;
        this.messages = messages;
    }
}
