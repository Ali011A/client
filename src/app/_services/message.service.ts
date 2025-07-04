
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { PaginationResult } from '../_models/pagination';
import { Message } from '../_models/message';
import { setPaginationHeaders, setPaginationResponse } from './PaginationHelper';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { User } from '../_models/user';
import { Group } from '../_models/group';
//import * as CryptoJS from 'crypto-js';
@Injectable({
  providedIn: 'root'
})
export class MessageService {

  baseUrl=environment.apiUrl;
    hubUrl=environment.hubsUrl;
  private http=inject(HttpClient);
   hubConnection?:HubConnection
  paginationResult=signal<PaginationResult<Message[]>|null>(null);
messageThreadSource=signal<Message[]>([]);
typingUserSignal = signal<string | null>(null);
typingTimeout?: any;
private currentUser?: User;

setCurrentUser(user: User) {
  this.currentUser = user;
}
createHubConnection(user:User,otherUsername:string){
this.hubConnection=new HubConnectionBuilder()
.withUrl(this.hubUrl+'message?user='+otherUsername,{
  accessTokenFactory:()=>user.token
})
.withAutomaticReconnect()
.build();

this.hubConnection
.start()
.catch(error=>console.log(error));
this.hubConnection.on('ReceiveMessageThread', (messages: Message[]) => {
    this.messageThreadSource.set(messages);
 // const decryptedMessages = messages.map((m: Message) => this.decryptMessage(m));
 // this.messageThreadSource.set(decryptedMessages);
});

 this.hubConnection.on('NewMessage', message => {
    this.messageThreadSource.update(messages => [...messages, message]);
  //    const decrypted = this.decryptMessage(message);
  // this.messageThreadSource.update(messages => [decrypted, ...messages]);
  });
this.hubConnection.on('UpdatedGroup', (group: Group) => {
  if (group.connections.some(x => x.username === otherUsername)) {
this.messageThreadSource.update(messages=>{
  messages.forEach(message => {
    if(!message.dateRead){
      message.dateRead=new Date(Date.now());
    }
  })
  return messages
})

  }

});
  this.hubConnection.on('UserTyping', (username: string) => {
    if (username !== user.username) {
      this.typingUserSignal.set(username);  //  هنديك دي كمان
      clearTimeout(this.typingTimeout);
      this.typingTimeout = setTimeout(() => {
        this.typingUserSignal.set(null);
      }, 3000);
    }
  });
}

stopHubConnection(){
  if(this.hubConnection?.state===HubConnectionState.Connected){
  this.hubConnection?.stop().catch(error=>console.log(error));
  }
}
notifyTyping(recipientUsername: string) {
  this.hubConnection?.invoke('Typing', recipientUsername)
    .catch(error => console.log(error));
}
getMessage(pageNumber:number,pageSize:number,container:string){
let params=setPaginationHeaders(pageNumber,pageSize);
params=params.append('Container',container);
return this.http.get<Message[]>
(this.baseUrl+'messages',{observe:'response',params})
.subscribe({
  next:response=>setPaginationResponse(response,this.paginationResult)
})
}

getMessageThread(username:string){
  return this.http.get<Message[]>(this.baseUrl+'messages/thread/'+username);
}
// private decryptMessage(message: Message): Message {
//   const sharedKey = this.getSharedKey(message.senderUsername, message.recipientUsername);

//   try {
//     // quick check: is it a valid base64? (AES output should be base64)
//     if (!/^[A-Za-z0-9+/=]+$/.test(message.content)) {
//       return message; // not encrypted → return as-is
//     }

//     const decryptedBytes = CryptoJS.AES.decrypt(message.content, sharedKey);
//     const originalText = decryptedBytes.toString(CryptoJS.enc.Utf8);

//     if (!originalText) {
//       return message; // fallback if decryption fails silently
//     }

//     return { ...message, content: originalText };
//   } catch (e) {
//     console.error('❌ Failed to decrypt message:', e);
//     return message;
//   }
// }

 async sendMessage(username:string,content:string){
  //return this.http.post<Message>(this.baseUrl+'messages',{recipientUsername:username,content});
 return this.hubConnection?.invoke('SendMessage', {recipientUsername:username,content})
// if (!this.currentUser?.username) return;

//   const sharedKey = this.getSharedKey(username, this.currentUser.username);
//   const encryptedContent = CryptoJS.AES.encrypt(content, sharedKey).toString();
//   console.log('Encrypted content:', encryptedContent);
//   return this.hubConnection?.invoke('SendMessage', {
//     recipientUsername: username,
//     content: encryptedContent
//   });
}

private getSharedKey(user1: string, user2: string): string {
  const sorted = [user1, user2].sort(); // to ensure same key on both sides
  return sorted.join('-secret-key');
}
deleteMessage(id:number){
  return this.http.delete(this.baseUrl+'messages/'+id);
}

}
