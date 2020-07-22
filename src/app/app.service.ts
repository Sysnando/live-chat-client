import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  constructor(private socket: Socket, private http: HttpClient) { }

  private msgUrl = environment.chat_server_host + '/api/msgs/';

  sendMessage(chatMsg: ChatMessage) {
    this.socket.emit('message', chatMsg);
  }

  joinChatRoom(chatMsg: ChatMessage) {
    this.socket.emit('join', chatMsg);
  }

  getMessages = (chatMsg) => {
    return Observable.create((observer) => {
      this.socket.on(chatMsg.room, (message) => {
        observer.next(message);
      });
    });
  }

  getOnline = (chatMsg) => {
    return Observable.create((observer) => {
      this.socket.on(chatMsg.room + '-online-users', (online) => {
        observer.next(online);
      });
    });
  }

  findAllMsgs(chatRoom: string) : Observable<ChatMessage[]> {
    return this.http.get<any[]>(this.msgUrl, {
      params: {
        room: chatRoom
      }
    });
  }
}

export class ChatMessage {
  room: string;
  user: string;
  
  color: string;
  time: string;
  msg: string;

  constructor(eventId, user) {
    this.room = eventId;
    this.user = user;
    this.color = this.getRandomColor(5);
    this.msg = '';
  }

  clean() {
    this.time = '';
    this.msg = '';
  }

  getRandomColor(brightness) {
    // Six levels of brightness from 0 to 5, 0 being the darkest
    var rgb = [Math.random() * 256, Math.random() * 256, Math.random() * 256];
    var mix = [brightness * 51, brightness * 51, brightness * 51]; //51 => 255/5
    var mixedrgb = [rgb[0] + mix[0], rgb[1] + mix[1], rgb[2] + mix[2]].map(function (x) { return Math.round(x / 2.0) })
    return "rgb(" + mixedrgb.join(",") + ")";
  }
}