import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsNotEmpty, IsString } from "class-validator";
import { UserDto } from "./user.dto";
import { RoomDto } from "./room.dto";

export class MessageDto {
    @ApiProperty({ example: '5f9d4f8a4f6ded2b3c6c9b9d' })
    @IsString()
    id: string;

    @ApiProperty({ example: RoomDto, type: () => RoomDto })
    @IsDefined()
    room: RoomDto;

    @ApiProperty({ example: UserDto })
    @IsDefined()
    to: UserDto;

    @ApiProperty({ example: UserDto })
    @IsDefined()
    from: UserDto;

    @ApiProperty({ example: 'Hello' })
    @IsString()
    content: string;

    @ApiProperty({ example: true })
    @IsNotEmpty()
    isRead: boolean;

    @ApiProperty({ example: '2020-10-30T12:00:00.000Z' })
    @IsNotEmpty()
    createdAt: Date;

    @ApiProperty({ example: '2020-10-30T12:00:00.000Z' })
    @IsNotEmpty()
    updatedAt: Date;

    @ApiProperty({ example: 'text' })
    @IsString()
    type: string;

    constructor(message: any) {
        this.id = message._id.toString();
        this.room = new RoomDto(message.room);
        this.to = new UserDto(message.to);
        this.from = new UserDto(message.from);
        this.content = message.content;
        this.isRead = message.isRead;
        this.createdAt = message.createdAt;
        this.updatedAt = message.updatedAt;
        this.type = message.type;
    }
}
