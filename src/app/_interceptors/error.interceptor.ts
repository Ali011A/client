import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router=inject(Router);
  const toastr=inject(ToastrService);

  return next(req).pipe(
    catchError(error=>{
      if (error) {
        switch (error.status) {
          case 400:
           if (error.error?.errors) {
              const validationErrors = Object.values(error.error.errors).flat() as string[];
              validationErrors.forEach(err => toastr.error(err, 'خطأ في الطلب'));
            } else if (typeof error.error === 'string') {
              toastr.error(error.error, 'خطأ في الطلب');
            } else {
              toastr.error('حدث خطأ غير متوقع', 'خطأ في الطلب');
            }
            break;
          case 401:
            toastr.error('غير مصرح', 'خطأ في المصادقة');
            break;
          case 404:
            toastr.error('المورد غير موجود', 'خطأ في البحث');
            router.navigateByUrl('/not-found');
            break;
          case 500:
            toastr.error('خطأ في الخادم', 'خطأ داخلي');
            router.navigateByUrl('/server-error');
            break;
          default:
            toastr.error('حدث خطأ غير متوقع', 'خطأ');
            console.error(error);
        }
      }
      throw error;
    })
  );
};
