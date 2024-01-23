import { Injectable } from '@nestjs/common';
import { Message } from 'src/schemas/message.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ChatService {
    constructor(@InjectModel(Message.name) private messageModel: Model<Message>) { }

    async addMessage(from: string, to: string, message: string): Promise<Message> {
        const createdMessage = new this.messageModel({ from, to, message });

        return await createdMessage.save();
    }

    async getMessages(from: string, to: string, page: number, pageSize: number): Promise<Message[]> {
        return await this.messageModel.find({
            $or: [
                { from, to },
                { from: to, to: from },
            ],
        }).sort({ createdAt: 'asc' }).exec();
    }
}
