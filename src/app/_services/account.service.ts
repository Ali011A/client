import { HttpClient } from '@angular/common/http';
import { Injectable , computed, inject, signal} from '@angular/core';
import { User } from '../_models/user';
import { map } from 'rxjs';
import { environment } from '../../environments/environment';
import { LikesService } from './likes.service';
import { PresenceService } from './presence.service';


@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private http= inject(HttpClient);
  private likeService=inject(LikesService);
  private presenceService=inject(PresenceService);
   baseUrl = environment.apiUrl;
   currentUser=signal<User|null>(null);
   roles=computed(()=>
  {
    const user=this.currentUser();
    if(user && user.token){
      const role = JSON.parse(atob(user.token.split('.')[1])).role;
      return Array.isArray(role) ? role : [role];
    }
    return [];
  }
  )
    constructor() {
    // تحميل المستخدم من localStorage عند بدء التطبيق
    this.loadUserFromStorage();
  }

  private loadUserFromStorage() {
    const userString = localStorage.getItem('user');
    if (userString) {
      const user = JSON.parse(userString);
      this.currentUser.set(user);
    }
  }
   login(model:any){
    return this.http.post<User>(this.baseUrl + 'account/login',model).pipe(
      map(user=>{
        if(user){
          localStorage.setItem('user',JSON.stringify(user));
          this.currentUser.set(user);
          return user; 
        }
        return null; // إذا لم يكن هناك مستخدم، ارجع null
      })
    );
   }
    register(model:any){
      return this.http.post<User>(this.baseUrl + 'account/register',model).pipe(
        map(user=>{
          if(user){
            localStorage.setItem('user',JSON.stringify(user));
            this.currentUser.set(user as User);
          }
        })
      );
    }
    setCurentUser(user:User){
      localStorage.setItem('user',JSON.stringify(user));
      this.currentUser.set(user);
      this.likeService.getLikeIds();
      this.presenceService.createHubConnection(user);
    }
   logout(){
    localStorage.removeItem('user');
    this.currentUser.set(null);
    this.presenceService.stopHubConnection();
   }
}
