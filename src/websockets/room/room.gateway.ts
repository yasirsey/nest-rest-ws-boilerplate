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
    async handleJoinRoom(client: Socket, receiverId: string) {
        const sender = client.handshake.auth.user;

        const room = await this.roomService.joinUserToRoom(sender, receiverId);

        if (room) {
            client.join(room.name);
        }
    }

    @SubscribeMessage('leaveRoom')
    @UseGuards(WsJwtGuard)
    async handleLeaveRoom(client: Socket, { sender, receiver }: { sender: string; receiver: string }) {
        await this.roomService.leaveUserFromRoom(sender, receiver);
        client.leave(`${sender}_${receiver}`);
    }
}
