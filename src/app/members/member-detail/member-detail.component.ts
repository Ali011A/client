import { Member } from './../../_models/member';
import { Component, computed, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { MembersService } from '../../_services/members.service';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TabDirective, TabsetComponent, TabsModule } from 'ngx-bootstrap/tabs';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { TimeagoModule} from 'ngx-timeago';
import { DatePipe, NgIf } from '@angular/common';
import { MemberMessagesComponent } from '../member-messages/member-messages.component';
import { Message } from '../../_models/message';
import { MessageService } from '../../_services/message.service';
import { PresenceService } from '../../_services/presence.service';
import { AccountService } from '../../_services/account.service';
import { HubConnectionState } from '@microsoft/signalr';
@Component({
  selector: 'app-member-detail',
  imports: [TabsModule,GalleryModule,RouterLink,RouterLinkActive,TimeagoModule,DatePipe,MemberMessagesComponent,NgIf],
  templateUrl: './member-detail.component.html',
  styleUrl: './member-detail.component.css'
})
export class MemberDetailComponent implements OnInit,OnDestroy {
  @ViewChild('memberTabs',{static:true}) memberTabs?:TabsetComponent
private memberService = inject(MembersService);
private messageService=inject(MessageService);
private accountService=inject(AccountService);
 presenceService=inject(PresenceService);
private route = inject(ActivatedRoute);
private router=inject(Router);
member:Member={} as Member;
images:GalleryItem[] = [];

 // member = signal<Member | null>(null);
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);
  isFollowing = signal<boolean>(false);
  activeTab?:TabDirective;
  messages:Message[]=[];
ngOnInit():void{
  //this.loadMember();
  this.route.data.subscribe({
    next:data=>{this.member=data['member'];
  this.member && this.member.photos.map(photo => {
          this.images.push(new ImageItem({
            src: photo.url,
            thumb: photo.url
          }));
        })
      }
  })
  this.route.paramMap.subscribe({
    next:_=>{
      this.onRouteParamsChange();
    }
  })
  this.route.queryParams.subscribe(params => {
    if (params['tab']) {
      this.selectTab(params['tab']);
    }
  })

}

// onUpdateMessages(event:Message){
// this.messages.push(event);
// }
selectTab(heading:string){
  if(this.memberTabs){
    const messageTab=this.memberTabs.tabs.find(x=>x.heading===heading);
    if(messageTab){
      messageTab.active=true;
    }
  }
}
onRouteParamsChange(){
  const user = this.accountService.currentUser();
  if(!user) return;
  if(this.messageService.hubConnection?.state===HubConnectionState.Connected
    &&this.activeTab?.heading==='Messages')
  {
this.messageService.hubConnection.stop().then(()=>{
  this.messageService.createHubConnection(user,this.member.userName);
})
  };
}
onTabActivated(data:TabDirective){
  this.activeTab=data;
  this.router.navigate([],
    {
      relativeTo:this.route,
      queryParams:{tab:this.activeTab.heading},
      queryParamsHandling:'merge'
    });
  if(this.activeTab.heading==='Messages' &&this.member){
  const user=this.accountService.currentUser();
  if(!user) return;
  this.messageService.createHubConnection(user,this.member.userName);
  }else{
    this.messageService.stopHubConnection();
  }
}
ngOnDestroy(): void {
   this.messageService.stopHubConnection();
}
// loadMember(){
//   const username=this.route.snapshot.paramMap.get('username');
//   if (username) {
//     this.memberService.getMember(username).subscribe({
//       next: (response) => {
//         this.member = response;
//       //  console.log('Member loaded:', response);
//         response.photos.map(photo => {
//           this.images.push(new ImageItem({
//             src: photo.url,
//             thumb: photo.url
//           }));
//         })
//       },
//       error: (error) => {
//         console.error('Error loading member:', error);
//       }
//     });
//   } else {
//     console.error('Username not found in route parameters');
//   }
// }


getInterestIcon(interest: string): string {
  const icons: Record<string, string> = {
    'Sports': '⚽',
    'Music': '🎵',
    'Movies': '🎬',
    'Reading': '📚',
    'Traveling': '✈️',
    'Photography': '📷',
    'Cooking': '🍳',
    'Gaming': '🎮',
    'Dancing': '💃'
  };
  return icons[interest] || '🌟';
}














}
