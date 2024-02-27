import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';
import { RoomDto } from 'src/schemas/dto/room.dto';

export class SearchRoomsResponseDto {
    @ApiProperty({ example: 1 })
    @IsInt()
    total: number;

    @ApiProperty({ example: 1 })
    @IsInt()
    page: number;

    @ApiProperty({ example: 10 })
    @IsInt()
    limit: number;

    @ApiProperty({ type: [RoomDto] })
    rooms: RoomDto[];

    constructor(total: number, page: number, limit: number, rooms: RoomDto[]) {
        this.total = total;
        this.page = page;
        this.limit = limit;
        this.rooms = rooms;
    }
}
