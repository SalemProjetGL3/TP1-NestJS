import { Injectable } from '@nestjs/common';

export interface Comment {
  id: number;
  user: string;
  content: string;
}

export interface Message {
    id: number;
    user: string;
    content: string;
    time: string;
    likes: number;
    likedBy: Set<number>;
}


@Injectable()
export class ChatService {
  private messages: Message[] = [];
  private messageCounter = 1;
  private commentCounter = 1;

  createMessage(user: string, content: string, time: string): Message {
      const message: Message = {
          id: this.messageCounter++,
          user,
          content,
          time,
          likes: 0,
          likedBy: new Set(),
      };
      this.messages.push(message);
      return message;
  }

  likeMessage(id: number, userId: number): Message | undefined {
      const message = this.messages.find((msg) => msg.id === id);
      if (message && !message.likedBy.has(userId)) {
          message.likes++;
          message.likedBy.add(userId);
      }
      return message;
  }

  deleteMessage(id: number): void {
      this.messages = this.messages.filter((msg) => msg.id !== id);
  }


  getAllMessages(): Message[] {
    return this.messages;
  }
}
