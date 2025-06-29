
import { Component, inject, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NavComponent } from "./nav/nav.component";
import { AccountService } from './_services/account.service';
import { HomeComponent } from "./home/home.component";
import { filter } from 'rxjs';
import { NgxSpinnerComponent } from 'ngx-spinner';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavComponent,NgxSpinnerComponent,NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {


private accountService=inject(AccountService);
  title = 'DatingApp';
  users: any;
    private router = inject(Router);
   hideNav = false;
    ngOnInit(): void {
 this.router.events.subscribe(() => {
    const showNav = this.shouldShowNav();
    if (showNav) {
      document.body.classList.add('has-navbar');
    } else {
      document.body.classList.remove('has-navbar');
    }
  });
    this.serCurrentUser();
      this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const currentRoute = this.router.routerState.snapshot.root;
      const hideNav = currentRoute.firstChild?.data?.['hideNav'] || false;
      this.hideNav = hideNav;
    });

  }
 shouldShowNav(): boolean {
    const currentUrl = this.router.url;
    const user = this.accountService.currentUser();

    // ✅ يظهر الـ navbar إذا:
    // - المستخدم مسجل دخول
    // - أو المستخدم مش مسجل دخول لكن بيحاول يعمل login
    return !!user || currentUrl !== '/';
  }
  serCurrentUser() {
    const userString = localStorage.getItem('user');
    if (userString) {
      const user = JSON.parse(userString);
      this.accountService.setCurentUser(user);
    } else {
      this.accountService.currentUser.set(null);
    }

  }





}
