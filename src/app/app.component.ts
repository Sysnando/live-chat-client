import { Component, OnInit } from '@angular/core';
import { AppService, ChatMessage } from './app.service';
import { formatDate } from '@angular/common';
import { environment } from 'src/environments/environment';

//XTODO Crescer 100% height do container pai
//TODO Chamar o login quando não estiver logado
//XTODO Somente contabilizar os users, se o mesmo estiver logado
//TODO Salvar as mensagens na base dados para poder apresentar o histórico
@Component({
  selector: 'chat-client',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  chatVariables: any;  
  online: number = 0;
  chatMsg: ChatMessage;
  chatMsgList: ChatMessage[] = [];

  constructor(private chatService: AppService) {}

  ngOnInit() {

    //0. join a chat room
    this.chatVariables = environment.variables;
    //console.log(this.chatVariables)
    if(this.chatVariables) {
      this.chatMsg = new ChatMessage(this.chatVariables.event_id, this.chatVariables.user_name);
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

      //3. get historic msgs
      this.chatService
        .findAllMsgs(this.chatMsg.room)
        .subscribe(msgs =>
          this.chatMsgList = msgs
        );
    }
  }

  sendMessage(){
    if(this.chatMsg && this.chatMsg.msg.length > 0) {
      this.chatMsg.time = formatDate(new Date(), 'hh:mm',  'en-US');
      this.chatService.sendMessage(this.chatMsg);

      //move focus to the last msg
      var objDiv = document.getElementById("divMsg");
      objDiv.scrollTop = objDiv.scrollHeight;
    }
    this.chatMsg.clean();  
  }
}
