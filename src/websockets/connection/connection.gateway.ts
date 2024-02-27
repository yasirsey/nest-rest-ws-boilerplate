import { WebSocketGateway, SubscribeMessage, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { WsJwtGuard } from '../ws.guard';
import { UserService } from 'src/modules/user/user.service';

@WebSocketGateway({
    cors: {
        credentials: true,
    }
})
export class ConnectionGateway {
    @WebSocketServer() server: Server;

    constructor(private readonly userService: UserService) { }

    @SubscribeMessage('connected')
    @UseGuards(WsJwtGuard)
    async handleConnection(client: Socket) {
        if(!client.handshake.auth.user) return;

        console.log('connected', client.handshake.auth.user.id)
        
        await this.userService.setUserOnlineStatus(client.handshake.auth.user.id, true);

        client.join(client.handshake.auth.user.id);
        client.join(`messages-${client.handshake.auth.user.id}`)
    }

    @SubscribeMessage('disconnected')
    @UseGuards(WsJwtGuard)
    async handleDisconnect(client: Socket) {
        if(!client.handshake.auth.user) return;

        console.log('disconnected', client.handshake.auth.user.id)
        
        await this.userService.setUserOnlineStatus(client.handshake.auth.user.id, false);

        client.leave(client.handshake.auth.user.id);
        client.leave(`messages-${client.handshake.auth.user.id}`)
    }
}
