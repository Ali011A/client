import {
  HubConnectionBuilder,
  HubConnection,
  HubConnectionState
} from '@microsoft/signalr';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { User } from '../_models/user';
import { take } from 'rxjs';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class PresenceService {
hubUrl=environment.hubsUrl;
private hubConnection?:HubConnection;
private toastr=inject(ToastrService);
onlineUsers=signal<string[]>([]) ;
private router=inject(Router);
createHubConnection(user:User){
  this.hubConnection=new HubConnectionBuilder()
  .withUrl(this.hubUrl+'presence', {
    accessTokenFactory:()=>user.token
  })
  .withAutomaticReconnect()
  .build();

  this.hubConnection
  .start()
  .catch(error=>console.log(error));

  this.hubConnection.on('UserIsOnline',username=>{
    this.onlineUsers.update(users=>[...users,username]);
  });

  this.hubConnection.on('UserIsOffline',username=>{
    this.onlineUsers.update(users=>[...users.filter(x=>x!==username)]);
  });
this.hubConnection.on('GetOnlineUsers',usernames=>{
  this.onlineUsers.set(usernames)
});
this.hubConnection.on('NewMessageReceived',({usrname,KnownAs})=>{
  this.toastr.info(KnownAs+'has sent you a new message! Click')
  .onTap.pipe(take(1))
  .subscribe(() => this.router.navigateByUrl('/members/'+usrname+'?tab=Messages'));
})
}
stopHubConnection(){
  if(this.hubConnection?.state===HubConnectionState.Connected){
  this.hubConnection?.stop().catch(error=>console.log(error));
  }

}
}
