import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { Member } from '../_models/member';
import { AccountService } from './account.service';
import { of, tap } from 'rxjs';
import { Photo } from '../_models/photo';
import { PaginationResult } from '../_models/pagination';
import { UserParams } from '../_models/userParams';
import { setPaginationHeaders, setPaginationResponse } from './PaginationHelper';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
private http= inject(HttpClient);
private accountService= inject(AccountService);
// استخدام البيئة لتحديد عنوان API
baseUrl =environment.apiUrl ;
//members=signal<Member[]>([]);
paginationResult=signal<PaginationResult<Member[]>|null>(null); // Signal to hold pagination result>
memberCache=new Map();
user=this.accountService.currentUser();
userParams=signal<UserParams>(new UserParams(this.user));
resetUserParams(){
  this.userParams.set(new UserParams(this.user));
}
constructor() { }
  getMembers() {
    const response=this.memberCache.get(Object.values(this.userParams()).join('-'));
    if(response) return setPaginationResponse(response,this.paginationResult); ;
    let params = setPaginationHeaders(this.userParams().pageNumber, this.userParams().pageSize);
    params=params.append('minAge',this.userParams().minAge);
    params=params.append('maxAge',this.userParams().maxAge);
    params=params.append('gender',this.userParams().gender!);
    params=params.append('orderBy',this.userParams().orderBy);
    return this.http.get<Member[]>(this.baseUrl + 'users',{observe:'response',params}).subscribe({
      next: (response) => {

      setPaginationResponse(response,this.paginationResult);
        this.memberCache.set(Object.values(this.userParams()).join('-'),response);
      },
      error: (error) => {
        console.error('Error loading members:', error);
      }
    });
  }




  getMember(username: string) {
    const member:Member=[...this.memberCache.values()].reduce(
      (arr,elem) => arr.concat(elem.body),[]
    ).find((member:Member) => member.userName === username);
    if(member) return of(member);
    return this.http.get<Member>(this.baseUrl + 'users/' + username);
  }
  // getHttpOptions() {
  //   const user = this.accountService.currentUser();
  //   if (user) {
  //     return {
  //       headers: {
  //         Authorization: `Bearer ${user.token}`
  //       }
  //     };
  //   }
  //   return {};
  // }

  updateMember(member: Member) {
    return this.http.put(this.baseUrl + 'users', member).pipe(
      // tap(()=>{
      //   this.members.update(members =>members.map(m => m.userName === member.userName ? member : m));
      // })
    )
  }
  setMainPhoto(photo:Photo) {
    return this.http.put(this.baseUrl + 'users/set-main-photo/' + photo.id, {}).pipe(
      // tap(() => {
      //   this.members.update(members => members.map(m => {
      //     if (m.photos) {
      //       m.photos.forEach(p => {
      //         if (p.isMain) p.isMain = false; // Set previous main photo to false
      //         if (p.id === photo.id) p.isMain = true; // Set new main photo to true
      //       });
      //     }
      //     return m;
      //   }));
      // })
    );
  }

  deletePhoto(photoId: number) {
    return this.http.delete(this.baseUrl + 'users/delete-photo/' + photoId).pipe(
      // tap(() => {
      //   this.members.update(members => members.map(m => {
      //     if (m.photos) {
      //       m.photos = m.photos.filter(p => p.id !== photoId); // Remove the deleted photo
      //     }
      //     return m;
      //   }));
      // })
    );
  }
}
