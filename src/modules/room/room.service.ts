import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { SearchRoomsRequestDto } from './dto/requests/search-my-rooms.request.dto';
import { SearchRoomsResponseDto } from './dto/responses/search-my-rooms.response.dto';
import { Room, RoomDocument } from 'src/schemas/room.schema';

@Injectable()
export class RoomService {
    constructor(@InjectModel(Room.name) private readonly roomModel: Model<RoomDocument>) { }

    async searchMyRooms(loggedInUserId: string, SearchRoomsRequestDto: SearchRoomsRequestDto): Promise<SearchRoomsResponseDto> {
        const { page = 1, pageSize = 10 } = SearchRoomsRequestDto;

        const total = await this.roomModel.countDocuments({ members: { $in: [loggedInUserId] } });

        const rooms = await this.roomModel.aggregate([
            {
                $match: {
                    members: { $in: [new Types.ObjectId(loggedInUserId)] }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'members',
                    foreignField: '_id',
                    as: 'member',
                    pipeline: [
                        {
                            $match: {
                                _id: { $ne: new Types.ObjectId(loggedInUserId) }
                            }
                        }
                    ]
                }
            },
            {
                $unwind: '$member'
            },
            {
                $lookup: {
                    from: 'messages',
                    localField: '_id',
                    foreignField: 'room',
                    as: 'lastMessage',
                    pipeline: [
                        {
                            $sort: {
                                createdAt: -1
                            }
                        },
                        {
                            $limit: 1
                        },
                        {
                            $project: {
                                fromMe: {
                                    $eq: ['$from', new Types.ObjectId(loggedInUserId)]
                                },
                                isRead: 1,
                                content: 1,
                                createdAt: 1
                            }
                        }
                    ]
                }
            },
            {
                $unwind: '$lastMessage'
            },
            {
                $lookup: {
                    from: 'messages',
                    localField: '_id',
                    foreignField: 'room',
                    as: 'unreadMessages',
                    pipeline: [
                        {
                            $match: {
                                from: { $ne: new Types.ObjectId(loggedInUserId) },
                                isRead: false
                            }
                        }
                    ]
                }
            },
            {
                $addFields: {
                    unreadMessagesCount: {
                        $size: '$unreadMessages'
                    }
                }
            },
            {
                $sort: {
                    'room.createdAt': -1
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    member: 1,
                    lastMessage: 1,
                    unreadMessagesCount: 1,
                    createdAt: 1
                }
            },
            {
                $skip: (page - 1) * pageSize
            },
            {
                $limit: Number(pageSize)
            },
        ]);

        return new SearchRoomsResponseDto(total, page, pageSize, rooms);
    }
}
