import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Message, MessageDocument } from 'src/schemas/message.schema';
import { SearchMyRoomMessagesRequestDto } from './dto/requests/search-my-room-messages.request.dto';
import { SearchMyRoomMessagesResponseDto } from './dto/responses/search-my-room-messages.response.dto';

@Injectable()
export class MessageService {
    constructor(@InjectModel(Message.name) private readonly messageModel: Model<MessageDocument>) { }

    async searchMyRoomMessages(roomId: string, searchMyRoomMessagesRequestDto: SearchMyRoomMessagesRequestDto): Promise<SearchMyRoomMessagesResponseDto> {
        const { page = 1, pageSize = 10 } = searchMyRoomMessagesRequestDto;

        const total = await this.messageModel.countDocuments({ room: new Types.ObjectId(roomId) });

        const skipCount = Number(pageSize) * (Number(page) - 1);

        const messages = await this.messageModel.aggregate([
            {
                $match: {
                    room: new Types.ObjectId(roomId)
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'from',
                    foreignField: '_id',
                    as: 'from',
                }
            },
            {
                $unwind: '$from'
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'to',
                    foreignField: '_id',
                    as: 'to',
                }
            },
            {
                $unwind: '$to'
            },
            {
                $sort: {
                    createdAt: -1
                }
            },
            {
                $project: {
                    _id: 1,
                    room: 1,
                    to: 1,
                    from: 1,
                    content: 1,
                    isRead: 1,
                    createdAt: 1,
                    type: 1,
                }
            },
            {
                $skip: skipCount
            },
            {
                $limit: Number(pageSize)
            },
        ]);

        return new SearchMyRoomMessagesResponseDto(total, page, pageSize, messages);
    }
}
