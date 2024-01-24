import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
    cors: {
        credentials: true,
    }
})
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
    constructor() { }

    @WebSocketServer() server: Server;

    async handleConnection(client: Socket) {
        console.log(`Client connected: ${client.id}`);
    }

    async handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);
    }

    @SubscribeMessage('systemMessage')
    handleSystemMessage(@MessageBody() message: string) {
        this.server.emit('systemMessage', message);
    }
}
