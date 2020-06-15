import { Component, OnInit, Input } from '@angular/core';
import { ChatService, ChatMessage } from './chat.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'chat-client',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  online: number = 0;
  chatMsg: ChatMessage;
  chatMsgList: ChatMessage[] = [];

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {

    //0. join a chat room
    this.chatMsg = new ChatMessage("Room", "User");
    this.chatService.joinChatRoom(this.chatMsg);

    //1. new chat messsages listener
    this.chatService
      .getMessages(this.chatMsg)
      .subscribe((message) => {   
        this.chatMsgList.push(message);
      });

    //2. online users count listener
    this.chatService
      .getOnline(this.chatMsg)
      .subscribe((online) => {   
        this.online = online;
      });
  }

  sendMessage(){
    if(this.chatMsg) {
      this.chatMsg.time = formatDate(new Date(), 'hh:mm',  'en-US');
      this.chatService.sendMessage(this.chatMsg);
    }
    this.chatMsg.clean();  
  }
}
