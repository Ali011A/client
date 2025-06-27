import { MembersService } from './../_services/members.service';
import { Component, inject, OnInit } from '@angular/core';
import { MessageService } from '../_services/message.service';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { FormsModule } from '@angular/forms';
import { TimeagoModule } from 'ngx-timeago';
import { Message } from '../_models/message';
import { RouterLink } from '@angular/router';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { ThemeService } from '../_services/theme.service';

@Component({
  selector: 'app-messages',
  imports: [ButtonsModule,NgIf, NgFor, NgClass,
    FormsModule,
    TimeagoModule,RouterLink
    ,PaginationModule,DatePipe],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css'
})
export class MessagesComponent implements OnInit {
messageService=inject(MessageService);
 themeService = inject(ThemeService);
container='Inbox';
pageNumber=1;
pageSize=5;
isOutbox=this.container==='Outbox';
ngOnInit(): void {
    this.loadMessages();
  
}
loadMessages(){
  this.messageService.getMessage(this.pageNumber,this.pageSize,this.container);
}
deleteMessage(id:number){
this.messageService.deleteMessage(id).subscribe({
  next:()=>{
    this.messageService.paginationResult.update(prev=>{
      if(prev && prev.items){
        prev.items.splice(prev.items.findIndex(m=>m.id===id),1);
        return prev
      }
      return prev
    });
  }
})
}
getRoute(message:Message){
  if(this.container==='Outbox') return`/members/${message.recipientUsername}`;
  else return `/members/${message.senderUsername}`;
}

 onPageChanged(evet:any){
    if(this.pageNumber !== evet.page){
      this.pageNumber=evet.page;
      this.loadMessages();
    }
  }

 get messages() {
  return this.messageService.paginationResult()?.items || [];
}

 toggleTheme() {
    this.themeService.toggleDarkMode();
  }

}
