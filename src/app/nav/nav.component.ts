import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../_services/account.service';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HasRoleDirective } from '../_directives/has-role.directive';


@Component({
  selector: 'app-nav',
  
  imports: [FormsModule,BsDropdownModule,RouterLink,RouterLinkActive,HasRoleDirective],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {
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

  logout() 
  {
    this.accountService.logout();
    console.log('Logout successful');
    this.router.navigateByUrl('/');
   // alert('تم تسجيل الخروج بنجاح. نأمل أن نراك قريبًا مرة أخرى! 💖');
   
  }
 get currentUser() {
    return this.accountService.currentUser();
  }
  register() {
    console.log(this.model);
  }
}
