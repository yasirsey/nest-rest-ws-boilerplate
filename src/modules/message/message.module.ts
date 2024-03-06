import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { Message, MessageSchema } from 'src/schemas/message.schema';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]), ConfigModule],
  providers: [MessageService],
  controllers: [MessageController],
})
export class MessageModule {}
