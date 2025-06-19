import { Member } from './../../_models/member';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MembersService } from '../../_services/members.service';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { TimeagoModule} from 'ngx-timeago';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-member-detail',
  imports: [TabsModule,GalleryModule,RouterLink,RouterLinkActive,TimeagoModule,DatePipe],
  templateUrl: './member-detail.component.html',
  styleUrl: './member-detail.component.css'
})
export class MemberDetailComponent implements OnInit {
private memberService = inject(MembersService);
private route = inject(ActivatedRoute);
member?:Member;
images:GalleryItem[] = [];

 // member = signal<Member | null>(null);
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);
  isFollowing = signal<boolean>(false);
ngOnInit():void{
  this.loadMember();
}

loadMember(){
  const username=this.route.snapshot.paramMap.get('username');
  if (username) {
    this.memberService.getMember(username).subscribe({
      next: (response) => {
        this.member = response;
        console.log('Member loaded:', response);
        response.photos.map(photo => {
          this.images.push(new ImageItem({
            src: photo.url,
            thumb: photo.url
          }));
        })
      },
      error: (error) => {
        console.error('Error loading member:', error);
      }
    });
  } else {
    console.error('Username not found in route parameters');
  }
}


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
