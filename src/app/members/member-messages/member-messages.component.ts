import {  Component, computed, ElementRef, inject, input, OnInit, output, ViewChild } from '@angular/core';
import { MessageService } from '../../_services/message.service';
import { Message } from '../../_models/message';
import { TimeagoModule } from 'ngx-timeago';
import { DatePipe, NgIf } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { effect } from '@angular/core';
@Component({
  selector: 'app-member-messages',
  imports: [TimeagoModule,FormsModule,NgIf],
  templateUrl: './member-messages.component.html',
  styleUrl: './member-messages.component.css'
})
export class MemberMessagesComponent  {
  @ViewChild('messageForm') messageForm?:NgForm;
 messageService=inject(MessageService);
username=input.required<string>();
//messges=input.required<Message[]>();
@ViewChild('messageList') messageList?: ElementRef;
messageContent='';
typing = false;
typingTimer?: any;
typingUser = computed(() => this.messageService.typingUserSignal());
//updateMessage=output<Message>();
  autoScrollEffect = effect(() => {
    const messages = this.messageService.messageThreadSource(); // this triggers the effect
    if (this.isUserAtBottom()) {
      setTimeout(() => this.scrollToBottom(), 100);
    }
  });


sendMessage( ){
  // console.log('Sending:', this.messageContent);
 this.messageService.sendMessage(this.username(), this.messageContent).then(() => {
    this.messageForm?.reset();
    setTimeout(() => {
      this.scrollToBottom();
    }, 100); // Slight delay to ensure DOM is updated
  });

}
  isUserAtBottom(): boolean {
    if (!this.messageList) return true;
    const el = this.messageList.nativeElement;
    const threshold = 150; // لو المستخدم قريب من تحت 150px اعتبره في الأسفل
    return el.scrollTop + el.clientHeight >= el.scrollHeight - threshold;
  }
scrollToBottom() {
  if (this.messageList) {
    const el = this.messageList.nativeElement;
    el.scrollTop = el.scrollHeight;
  }
}
loadMessages(){
  // this.messageService.getMessageThread(this.username() ).subscribe({
  //   next:messges=>this.messges=messges
  // })
}
onTyping() {
  this.messageService.notifyTyping(this.username());
}
}
