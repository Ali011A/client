import { Component, computed, inject, input, output, signal } from '@angular/core';
import { Member } from '../../_models/member';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LikesService } from '../../_services/likes.service';
import { PresenceService } from '../../_services/presence.service';

@Component({
  selector: 'app-member-card',
  imports: [RouterLink],
  templateUrl: './member-card.component.html',
  styleUrl: './member-card.component.css'
})
export class MemberCardComponent {
private likeService=inject(LikesService);
private presenceService=inject(PresenceService);
  member=input.required<Member>();
hasLiked = computed(()=>this.likeService.likeIds().includes(this.member().id));
isOnline=computed(()=>this.presenceService.onlineUsers().includes(this.member().userName));
 // Output events
  cardClicked = output<Member>();
  profileViewed = output<Member>();
  memberLiked = output<Member>();
  messageRequested = output<Member>();
  
  // Component state
  private imageError = signal(false);

  /**
   * Check if member is currently online
   * Based on lastActive being within last 5 minutes
   */
  // isOnline(): boolean {
  //   const member = this.member();
  //   if (!member.lastActive) return false;
    
  //   const now = new Date();
  //   const lastActive = new Date(member.lastActive);
  //   const diffInMinutes = (now.getTime() - lastActive.getTime()) / (1000 * 60);
    
  //   return diffInMinutes <= 5;
  // }

  toggleLike(){
    this.likeService.toggleLike(this.member().id).subscribe({
      next:()=>{
    if(this.hasLiked()){
      this.likeService.likeIds.update(ids=>ids.filter(x=>x!==this.member().id));
    } 
    else{
      this.likeService.likeIds.update(ids=>[...ids,this.member().id]);
    }
      }
    })
  }
  /**
   * Get formatted last active text
   */
  getLastActiveText(): string {
    const member = this.member();
    if (!member.lastActive) return 'Unknown';
    
    const now = new Date();
    const lastActive = new Date(member.lastActive);
    const diffInHours = (now.getTime() - lastActive.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Active now';
    } else if (diffInHours < 24) {
      const hours = Math.floor(diffInHours);
      return `${hours}h ago`;
    } else {
      const days = Math.floor(diffInHours / 24);
      return `${days}d ago`;
    }
  }

  /**
   * Get preview of introduction (first 80 characters)
   */
  getIntroductionPreview(): string {
    const member = this.member();
    if (!member.introduction) return '';
    
    const maxLength = 80;
    if (member.introduction.length <= maxLength) {
      return member.introduction;
    }
    
    return member.introduction.substring(0, maxLength) + '...';
  }

  /**
   * Parse interests string into array and limit to first 3
   */
  getInterestsList(): string[] {
    const member = this.member();
    if (!member.interests) return [];
    
    // Split by comma, semicolon, or pipe and clean up
    const interests = member.interests
      .split(/[,;|]/)
      .map(interest => interest.trim())
      .filter(interest => interest.length > 0)
      .slice(0, 3); // Limit to first 3 interests
    
    return interests;
  }

  /**
   * Handle image loading error
   */
  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/default-avatar.jpg'; // Fallback image
    this.imageError.set(true);
  }

  /**
   * Handle card click
   */
  onCardClick(): void {
    this.cardClicked.emit(this.member());
  }

  /**
   * Handle view profile button click
   */
  onViewProfile(event: Event): void {
    event.stopPropagation(); // Prevent card click
    this.profileViewed.emit(this.member());
  }

  /**
   * Handle like button click
   */
  onLike(event: Event): void {
    event.stopPropagation(); // Prevent card click
    this.memberLiked.emit(this.member());
  }

  /**
   * Handle message button click
   */
  onMessage(event: Event): void {
    event.stopPropagation(); // Prevent card click
    this.messageRequested.emit(this.member());
  }

  /**
   * Calculate member age from birth date if needed
   * (Alternative method if age is not directly provided)
   */
  private calculateAge(birthDate: Date): number {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  }
}
