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
    async handleSendMessage(client: Socket, { receiverId, content }: { receiverId: string; content: string }) {
        const sender = client.handshake.auth.user;
        const { room, message, member } = await this.messageService.addMessage(sender, receiverId, content);

        if (message) {
            this.server.to(room.name).emit('newMessage', message);

            this.server.to(`messages-${receiverId}`).emit('new-message', {
                room,
                message: {
                    ...message,
                    fromMe: false,
                },
                member,
            });

            this.server.to(`messages-${sender.id}`).emit('new-message', {
                room,
                message: {
                    ...message,
                    fromMe: true,
                },
                member,
            });
        }

        return message;
    }
}
