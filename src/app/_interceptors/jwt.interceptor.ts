import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AccountService } from '../_services/account.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
 const accountService = inject(AccountService); // Assuming AccountService is provided in the app module

 if( accountService.currentUser()) {
  const token = accountService.currentUser()?.token; // Get the token from the current user
  if (token) {
    // Clone the request and set the new header in one step
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}` // Set the Authorization header with the token
      }
    });
 }
}

  return next(req);
};
