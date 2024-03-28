import { WebSocketGateway, SubscribeMessage, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RoomService } from './room.service';
import { UseGuards } from '@nestjs/common';
import { WsJwtGuard } from '../ws.guard';

@WebSocketGateway({
    cors: {
        credentials: true,
    }
})
export class RoomGateway {
    @WebSocketServer() server: Server;

    constructor(private readonly roomService: RoomService) { }

    @SubscribeMessage('joinRoom')
    @UseGuards(WsJwtGuard)
    async handleJoinRoom(client: Socket, receiverId: string): Promise<any> {
        const sender = client.handshake.auth.user;

        const room = await this.roomService.joinUserToRoom(sender, receiverId);

        if (room) {
            client.join(room.name);
        }

        return room
    }

    @SubscribeMessage('leaveRoom')
    @UseGuards(WsJwtGuard)
    async handleLeaveRoom(client: Socket, receiverId: string) {
        const senderId = client.handshake.auth.user.id;

        const room = await this.roomService.leaveUserFromRoom(senderId, receiverId);

        if (room) {
            client.leave(room.name);
        }
    }
}
