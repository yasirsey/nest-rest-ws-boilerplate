import { WebSocketGateway, SubscribeMessage, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { WsJwtGuard } from '../ws.guard';
import { UserService } from 'src/modules/user/user.service';
import { SearchUserRequestDto } from 'src/modules/user/dto/requests/search-user.request.dto';

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
        
        await this.userService.setUserOnlineStatus(client.handshake.auth.user.id, true);

        this.notifyOnlineUsersUpdate();
    }

    @SubscribeMessage('disconnected')
    @UseGuards(WsJwtGuard)
    async handleDisconnect(client: Socket) {
        if(!client.handshake.auth.user) return;
        
        await this.userService.setUserOnlineStatus(client.handshake.auth.user.id, false);

        this.notifyOnlineUsersUpdate();
    }

    private async notifyOnlineUsersUpdate() {
        const onlineUsers = await this.userService.searchOnlineUsers();
        this.server.emit('onlineUsers', onlineUsers);
    }
}
