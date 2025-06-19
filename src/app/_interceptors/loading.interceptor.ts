import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { BusyService } from '../_services/busy.service';
import { delay, finalize } from 'rxjs';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const busyService=inject(BusyService);
  // Show the busy indicator before the request is sent
  busyService.busyStart();
  // Use the idle method to hide the busy indicator after the request is completed


  return next(req).pipe(
    delay(1000), // Optional: Add a delay to simulate loading time
    finalize(() => {
      busyService.idle(); // Hide the busy indicator when the request is complete
})
  );
};
