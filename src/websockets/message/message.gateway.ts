import { WebSocketGateway, SubscribeMessage, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageService } from './message.service';
import { UseGuards } from '@nestjs/common';
import { WsJwtGuard } from '../ws.guard';

@WebSocketGateway({
    cors: {
        credentials: true,
    }
})
export class MessageGateway {
    @WebSocketServer() server: Server;

    constructor(private readonly messageService: MessageService) { }

    @SubscribeMessage('sendMessage')
    @UseGuards(WsJwtGuard)
    async handleSendMessage(client: Socket, { receiver, content }: { receiver: string; content: string }) {
        const sender = client.handshake.auth.user;
        const {room, message} = await this.messageService.addMessage(sender, receiver, content);

        if (message) {
            this.server.to(room.name).emit('newMessage', message);
        }

        return message;
    }
}
