import { inject, Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class BusyService {

  busyRequestCount = 0;
  private busyServices=inject(NgxSpinnerService);
  // استخدام NgxSpinnerService لإدارة حالة التحميل
  busy = false;

  constructor() { }

  busyStart() {
    this.busyRequestCount++;
    if (!this.busy) {
      this.busy = true;
      // بدء عرض مؤشر التحميل
      this.busyServices.show(
        undefined,{
          type: 'line-scale-party',
          bdColor: 'rgba(255, 255, 255, 0.7)',
          color: '#333333'
        }
      );
    }
  }

  idle(){
    this.busyRequestCount--;
    if (this.busyRequestCount <= 0) {
      this.busyRequestCount = 0;
      this.busy = false;
      // إخفاء مؤشر التحميل
      this.busyServices.hide();
    }
  }

  busyEnd() {
    this.busyRequestCount--;
    if (this.busyRequestCount <= 0) {
      this.busyRequestCount = 0;
      this.busy = false;
    }
  }

  isBusy() {
    return this.busy;
  }


}
