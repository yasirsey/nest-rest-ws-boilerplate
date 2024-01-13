import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { UserDocument } from "src/schemas/user.schema";

export class DeleteUserResponseDto {
    @ApiProperty({ example: '5f9d4f8a4f6ded2b3c6c9b9d' })
    @IsString()
    id: string;

    constructor(user: UserDocument) {
        this.id = user._id.toString();
    }
}
