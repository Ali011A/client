import { Component, inject } from '@angular/core';
import { AccountService } from '../../_services/account.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-login',
  imports: [FormsModule,BsDropdownModule ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
   animations: [
    trigger('fadeIn', [
      state('void', style({ opacity: 0, transform: 'translateY(-20px)' })),
      transition(':enter', [
        animate('0.6s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('slideIn', [
      state('void', style({ transform: 'translateX(-50px)', opacity: 0 })),
      transition(':enter', [
        animate('0.8s ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ])
    ])
  ]
})
export class LoginComponent {
  accountService=inject(AccountService);
 private router=inject(Router);
 private toaster=inject(ToastrService);
model:any={};


 login() {
  
    this.accountService.login(this.model).subscribe({
      next: (response) => {
     
         console.log('Login successful:', response);
        this.toaster.success(`مرحباً$! تم تسجيل دخولك بنجاح. مرحباً بك في عائلتنا! 💖`);
       this.router.navigateByUrl('/members');

        
      },
      error: (error) => {
        this.toaster.error(error.error);
        //console.error('Login failed:', error); 
    
      }
    });
  }
 get currentUser() {
    return this.accountService.currentUser();
  }


}
