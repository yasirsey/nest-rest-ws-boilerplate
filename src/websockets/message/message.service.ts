import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Room } from 'src/schemas/room.schema';
import { User } from 'src/schemas/user.schema';
import { generateRoomName } from '../helpers/generateRoomId';
import { Message } from 'src/schemas/message.schema';
import { UserDto } from 'src/schemas/dto/user.dto';
import { UserService } from 'src/modules/user/user.service';
import { S3ConfigService } from 'src/config/s3.service';

@Injectable()
export class MessageService {
    constructor(@InjectModel(Room.name) private roomModel: Model<Room>,
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(Message.name) private messageModel: Model<Message>,
        private readonly userService: UserService,
        private readonly s3ConfigService: S3ConfigService) { }

    async addMessage(sender: UserDto, receiverId: string, content: string, type: string): Promise<any> {
        const receiver = await this.userService.getById(receiverId);

        if (!sender || !receiver) {
            throw new Error('User not found');
        }

        const roomName = generateRoomName(sender.id, receiver.id);

        const room = await this.roomModel.findOne({ name: roomName }).exec();

        if (!room) {
            throw new Error('Room not found');
        }

        if(type == 'image') {
            const keyName = `chat-images/${new Types.ObjectId()}.png`;
            await this.s3ConfigService.uploadBase64Image(content, keyName);

            content = await this.s3ConfigService.getSignedUrl(keyName);
        }

        const message = await this.messageModel.findOneAndUpdate({ _id: new Types.ObjectId() }, {
            from: new Types.ObjectId(sender.id),
            to: new Types.ObjectId(receiverId),
            content,
            room: new Types.ObjectId(room.id),
            type,
        }, {
            new: true,
            upsert: true,
            runValidators: true,
            setDefaultsOnInsert: true,
        }).populate('room').populate('from').populate('to')

        return {
            room,
            message: message.toObject(),
            member: sender,
        };
    }
}
