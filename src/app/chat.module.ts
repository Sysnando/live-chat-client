import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule  } from "@angular/forms";
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

import { ChatComponent } from './chat.component';
import { environment } from 'src/environments/environment';

const config: SocketIoConfig = { url: environment.chat_server_host, options: {} };

@NgModule({
  declarations: [
    ChatComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [],
  bootstrap: [ChatComponent]
})
export class ChatModule { }

