import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsString } from "class-validator";
import { UserDto } from "./user.dto";
import { MessageDto } from "./message.dto";

export class RoomDto {
    @ApiProperty({ example: '5f9d4f8a4f6ded2b3c6c9b9d' })
    @IsString()
    id: string;

    @ApiProperty({ example: RoomDto })
    name: string;

    @ApiProperty({ example: UserDto})
    @IsDefined()
    member: UserDto;

    @ApiProperty({ example: MessageDto, type: () => MessageDto })
    @IsDefined()
    lastMessage: MessageDto;

    @ApiProperty({ example: '2020-10-30T12:00:00.000Z' })
    createdAt: Date;

    constructor(room: any) {
        this.id = room._id.toString();
        this.name = room.name;
        this.member = new UserDto(room.member);
        this.lastMessage = new MessageDto(room.lastMessage);
        this.createdAt = room.createdAt;
    }
}
