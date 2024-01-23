import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket, WsResponse } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { SendMessageDto } from './dto/send.message.dto';
import { WsJwtGuard } from '../ws.guard';
import { GetMessagesDto } from './dto/get.messages.dto';

@WebSocketGateway({
  cors: {
    credentials: true,
  }
})
export class ChatGateway {
  @WebSocketServer() server: Server;

  constructor(private readonly chatService: ChatService) { }

  @SubscribeMessage('sendMessage')
  @UsePipes(new ValidationPipe())
  @UseGuards(WsJwtGuard)
  async handleSendMessage(@MessageBody() sendMessageDto: SendMessageDto, @ConnectedSocket() client: Socket) {
    const sender = client.handshake.auth.user.id;
    
    const message = await this.chatService.addMessage(sender, sendMessageDto.to, sendMessageDto.message);
    
    this.server.to(client.id).emit('sentMessage', message);
    this.server.to(sendMessageDto.to).emit('newMessage', message);
  }

  @SubscribeMessage('getMessages')
  @UsePipes(new ValidationPipe())
  @UseGuards(WsJwtGuard)
  async handleGetMessages(@MessageBody() getMessagesDto: GetMessagesDto, @ConnectedSocket() client: Socket) {
    const sender = client.handshake.auth.user.id;
    const messages = await this.chatService.getMessages(sender, getMessagesDto.to, getMessagesDto.page, getMessagesDto.pageSize);

    return messages;
  }
}
