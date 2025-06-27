import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';

export const adminGuard: CanActivateFn = (route, state) => {
  const accountServices=inject(AccountService);
  const toastr= inject(ToastrService);
  if(accountServices.roles().includes('Admin') || accountServices.roles().includes('Moderator')){


    return true;
  }else{
        toastr.error(' تم تسجيل الدخول بواسطة مستخدم عادي لا يمكنك الوصول لهذه الصفحة');
        return false;
  }
  
};
