import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService, Message, Comment } from './chat.service';

@WebSocketGateway(3001, { cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  handleConnection(client: Socket) {
    client.broadcast.emit('connection',`Client connected : ${client.id}` );
    client.emit('connected', 'Welcome to the chat!' );
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.server.emit('disconnection', `Client disconnected : ${client.id}` );
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('sendMessage')
  handleMessage(@MessageBody() data: { user: string, content: string, time: string }) {
      const message = this.chatService.createMessage(data.user, data.content, data.time);
      this.server.emit('newMessage', message);
  }

  @SubscribeMessage('deleteMessage')
  handleDeleteMessage(@MessageBody() id: number) {
      this.chatService.deleteMessage(id);
      this.server.emit('deleteMessage', id);
  }

  @SubscribeMessage('likeMessage')
  handleLikeMessage(@MessageBody() data: { id: number, userId: number }) {
      const message = this.chatService.likeMessage(data.id, data.userId);
      if (message) {
          this.server.emit('likeUpdated', { id: message.id, likes: message.likes });
      }
  }

  @SubscribeMessage('typing')
  handleTyping(@MessageBody() user: string) {
      this.server.emit('userTyping', user);
  }





  @SubscribeMessage('getMessages')
  handleGetMessages(): Message[] {
    return this.chatService.getAllMessages();
  }
}
