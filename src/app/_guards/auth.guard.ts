import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';

export const authGuard: CanActivateFn = (route, state) => {

  const accountService=inject(AccountService);
  const toaster=inject(ToastrService);
  if(accountService.currentUser()) {

    return true; 
  }
  else{
      toaster.error('يرجى تسجيل الدخول للوصول إلى هذه الصفحة.');
      return false;
    }

};
