import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Room } from 'src/schemas/room.schema';
import { User } from 'src/schemas/user.schema';
import { generateRoomName } from '../helpers/generateRoomId';
import { Message } from 'src/schemas/message.schema';
import { UserDto } from 'src/schemas/dto/user.dto';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class MessageService {
    constructor(@InjectModel(Room.name) private roomModel: Model<Room>,
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(Message.name) private messageModel: Model<Message>,
        private readonly userService: UserService) { }

    async addMessage(sender: UserDto, receiverId: string, content: string): Promise<any> {
        const receiver = await this.userService.getById(receiverId);
        if (!sender || !receiver) {
            throw new Error('User not found');
        }

        const roomName = generateRoomName(sender.id, receiver.id);

        const room = await this.roomModel.findOne({ name: roomName }).exec();

        if (!room) {
            throw new Error('Room not found');
        }

        const message = await this.messageModel.create({
            from: sender.id,
            to: receiver.id,
            content,
            room: room.id
        });

        return {message, room};
    }
}
