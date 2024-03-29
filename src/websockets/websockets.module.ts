import { Module } from '@nestjs/common';
import { AppGateway } from './app.gateway';
import { UserModule } from 'src/modules/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from 'src/schemas/message.schema';
import { RoomGateway } from './room/room.gateway';
import { RoomService } from './room/room.service';
import { Room, RoomSchema } from 'src/schemas/room.schema';
import { User, UserSchema } from 'src/schemas/user.schema';
import { MessageGateway } from './message/message.gateway';
import { MessageService } from './message/message.service';
import { ConnectionGateway } from './connection/connection.gateway';
import { S3ConfigService } from 'src/config/s3.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    MongooseModule.forFeature([{ name: Room.name, schema: RoomSchema }]),
    UserModule],
  providers: [AppGateway, ConnectionGateway, RoomGateway, RoomService, MessageGateway, MessageService, S3ConfigService],
})
export class WebsocketsModule { }
