import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { LikesService } from '../_services/likes.service';
import { Member } from '../_models/member';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { FormsModule } from '@angular/forms';
import { MemberCardComponent } from '../members/member-card/member-card.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';

@Component({
  selector: 'app-lists',
  imports: [ ButtonsModule,FormsModule ,MemberCardComponent,PaginationModule],
  templateUrl: './lists.component.html',
  styleUrl: './lists.component.css'
})
export class ListsComponent implements OnInit ,OnDestroy  {
 likeService=inject(LikesService)
//members:Member[]=[];
predicate='liked';
pageNumber=1;
PageSize=5;


  ngOnInit(): void {
      this.loadLikes();
  }
  get members() {
  return this.likeService.paginationResult()?.items || [];
}
 getTitle(): string {
  switch (this.predicate) {
    case 'liked':
      return 'Members you liked <i class="fa fa-heart heart-icon"></i>';
    case 'likedBy':
      return 'Members who liked you <i class="fa fa-eye like-icon"></i>';
    default:
      return 'Mutual likes <i class="fa fa-retweet mutual-icon"></i>';
  }
}
  loadLikes(){
    this.likeService.getLikes(this.predicate,this.pageNumber,this.PageSize);
  }

  onPageChanged(evet:any){
    if(this.pageNumber !== evet.page){
      this.pageNumber=evet.page;
      this.loadLikes();
    }
  }
  ngOnDestroy(): void {
     this.likeService.paginationResult.set(null); 
  }
}
