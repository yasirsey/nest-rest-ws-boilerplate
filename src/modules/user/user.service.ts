import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Model, isValidObjectId } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { SearchUserRequestDto } from './dto/requests/search-user.request.dto';
import { SearchUserResponseDto } from './dto/responses/search-user.response.dto';
import { GetUserByIdRequestDto } from './dto/requests/get-user-by-id.request.dto';
import { UserDto } from '../../schemas/dto/user.dto';
import { RegisterRequestDto } from './dto/requests/register-user.request.dto';
import { DeleteUserResponseDto } from './dto/responses/delete-user.response.dto';
import { UpdateUserRequestDto } from './dto/requests/update-user.dto';
import { S3ConfigService } from 'src/config/s3.service';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>, private readonly s3ConfigService: S3ConfigService) { }

    async register(registerRequestDto: RegisterRequestDto): Promise<UserDto> {
        await this.checkIfUserExists(registerRequestDto.email);

        const createdUser = new this.userModel(registerRequestDto);

        const savedUser = await createdUser.save();

        return new UserDto(savedUser);
    }

    async search(searchUserDto: SearchUserRequestDto): Promise<SearchUserResponseDto> {
        const { fullName, email, role, gender, page = 1, pageSize = 10 } = searchUserDto;

        const query = this.userModel.find();

        if (fullName) {
            query.where({ fullName: { $regex: new RegExp(fullName, 'i') } });
        }

        if (email) {
            query.where({ email: { $regex: new RegExp(email, 'i') } });
        }

        if (role) {
            query.where({ role });
        }

        if (gender) {
            query.where({ gender })
        }

        const total = await this.userModel.countDocuments(query.getQuery());

        let users = await query
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .lean()
            .exec();


        // users = await Promise.all(users.map(async (user) => {
        //     const keyName = `profile-photos/${user._id}.png`;

        //     user.profilePhoto = await this.s3ConfigService.getSignedUrl(keyName);

        //     return user;
        // }));

        return new SearchUserResponseDto(total, page, pageSize, users)
    }

    async searchOnlineUsers(currentUserId: string): Promise<UserDto[]> {
        let users = await this.userModel.find({
            isOnline: true,
            _id: { $ne: currentUserId }
        }).lean().exec();

        // users = await Promise.all(users.map(async (user) => {
        //     const keyName = `profile-photos/${user._id}.png`;

        //     user.profilePhoto = await this.s3ConfigService.getSignedUrl(keyName);

        //     return user;
        // }));

        return users.map(user => new UserDto(user));
    }

    async getById(userId: string): Promise<UserDto> {
        if (!isValidObjectId(userId)) {
            throw new NotFoundException('User not found');
        }

        const user = await this.userModel.findById(userId).exec();

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const keyName = `profile-photos/${user._id}.png`;

        // if(!user.profilePhoto) {
        //     user.profilePhoto = undefined;
        // } else {
        //     user.profilePhoto = await this.s3ConfigService.getSignedUrl(keyName);
        // }

        return new UserDto(user);
    }

    async updateById(userId: string, updateUserDto: UpdateUserRequestDto): Promise<UserDto> {
        if (!isValidObjectId(userId)) {
            throw new NotFoundException('User not found');
        }

        const user = await this.userModel.findById(userId).exec();

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const { fullName, email, bio } = updateUserDto;

        if (fullName) {
            user.fullName = fullName;
        }

        if (email && email !== user.email) {
            await this.checkIfUserExists(email);
            user.email = email;
        }

        if (bio) {
            user.bio = bio;
        }

        const res = await user.save();

        return new UserDto(res);
    }

    async updateMyProfilePhoto(userId: string, profilePhotoBase64: string): Promise<UserDto> {
        const user = await this.userModel.findById(userId).exec();

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const keyName = `profile-photos/${userId}`;

        await this.s3ConfigService.uploadBase64Image(profilePhotoBase64, keyName);

        user.profilePhoto = await this.s3ConfigService.getSignedUrl(keyName);

        const res = await user.save();

        return new UserDto(res);
    }

    async delete(getUserRequestDto: GetUserByIdRequestDto): Promise<DeleteUserResponseDto> {
        const { id } = getUserRequestDto;

        if (!isValidObjectId(id)) {
            throw new NotFoundException('User not found');
        }

        const user = await this.userModel.findByIdAndDelete(id).exec();

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return new DeleteUserResponseDto(user);
    }

    private async checkIfUserExists(email: string): Promise<void> {
        const existingUser = await this.userModel.findOne({ email });

        if (existingUser) {
            throw new ConflictException('User with this email already exists');
        }
    }

    async comparePassword(userId: string, password: string): Promise<boolean> {
        const user = await this.userModel.findById(userId).exec();

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user.comparePassword(password);
    }

    async setUserOnlineStatus(userId: string, isOnline: boolean): Promise<void> {
        const user = await this.userModel.findById(userId).exec();

        if (!user) {
            throw new NotFoundException('User not found');
        }

        user.isOnline = isOnline;
        user.lastOnline = new Date();

        await user.save();
    }
}
