import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsNotEmpty, IsString } from "class-validator";
import { Gender } from "src/enums/gender.enum";
import { Role } from "src/enums/role.enum";
import { UserDocument } from "src/schemas/user.schema";

export class UserDto {
    @ApiProperty({ example: '5f9d4f8a4f6ded2b3c6c9b9d' })
    @IsString()
    id: string;

    @ApiProperty({ example: 'Severus Snape' })
    @IsString()
    fullName: string;

    @ApiProperty({ example: 'test@gmail.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'bio desc' })
    @IsString()
    bio: string;

    @ApiProperty({ example: 'https://s3.eu-central-1.amazonaws.com/...' })
    @IsString()
    profilePhoto: string;

    @ApiProperty({ example: 'male' })
    @IsEnum(Gender)
    gender: string;

    @ApiProperty({ example: ['user'] })
    @IsNotEmpty()
    @IsEnum(Role, { each: true })
    roles: string[];

    @ApiProperty({ example: true })
    isOnline: boolean;

    @ApiProperty({ example: '2020-10-30T12:00:00.000Z' })
    lastOnline: Date;

    constructor(user: UserDocument) {
        this.id = user._id.toString();
        this.fullName = user.fullName;
        this.email = user.email;
        this.bio = user.bio;
        this.gender = user.gender;
        this.roles = user.roles;
        this.profilePhoto = user.profilePhoto;
        this.isOnline = user.isOnline;
        this.lastOnline = user.lastOnline;
    }
}
