import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Room } from 'src/schemas/room.schema';
import { User } from 'src/schemas/user.schema';
import { WsException } from '@nestjs/websockets';
import { generateRoomName } from '../helpers/generateRoomId';
import { UserDto } from 'src/schemas/dto/user.dto';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class RoomService {
    constructor(@InjectModel(Room.name) private roomModel: Model<Room>,
        @InjectModel(User.name) private userModel: Model<User>,
        private readonly userService: UserService) { }

    async joinUserToRoom(sender: UserDto, receiverId: string): Promise<Room> {
        const receiver = await this.userService.getById(receiverId);

        if (!sender || !receiver) {
            throw new WsException('User not found');
        }

        const roomName = generateRoomName(sender.id, receiver.id);

        const updatedRoom = await this.roomModel.findOneAndUpdate(
            { name: roomName },
            {
                $addToSet: {
                    members: { $each: [new Types.ObjectId(sender.id), new Types.ObjectId(receiver.id)] }
                }
            },
            { new: true, upsert: true }
        ).exec();

        return updatedRoom;
    }

    async leaveUserFromRoom(senderId: string, receiverId: string): Promise<Room> {
        const sender = (await this.userModel.findOne({ _id: senderId }).exec()).toModel();
        const receiver = (await this.userModel.findOne({ _id: receiverId }).exec()).toModel();

        if (!sender || !receiver) {
            return;
        }

        const roomName = generateRoomName(sender.id, receiver.id);
        const room = await this.roomModel.findOne({ name: roomName }).exec();

        if (!room) {
            return;
        }

        room.members = room.members.filter(member => member.toString() !== sender.id && member.toString() !== receiver.id);
        await room.save();

        return room;
    }
}
