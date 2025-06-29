import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import{ provideToastr } from 'ngx-toastr';
import { errorInterceptor } from './_interceptors/error.interceptor';
import { jwtInterceptor } from './_interceptors/jwt.interceptor';
import { NgxSpinnerModule } from "ngx-spinner";
import { loadingInterceptor } from './_interceptors/loading.interceptor';
import { TimeagoModule } from "ngx-timeago";
import {ModalModule} from 'ngx-bootstrap/modal';
import { ReactiveFormsModule } from '@angular/forms';
export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes)
,provideHttpClient(withInterceptors([errorInterceptor,jwtInterceptor,loadingInterceptor]))
,provideAnimations(),
provideToastr({
  timeOut: 3000,
  positionClass: 'toast-bottom-right',
  preventDuplicates: true,
  closeButton: true,
  progressBar: true,
  progressAnimation: 'decreasing',
  easeTime: 300,
  tapToDismiss: true,
  maxOpened: 5,
  autoDismiss: true,
  enableHtml: true,
  titleClass: 'toast-title',
  messageClass: 'toast-message',
  iconClasses: {
    error: 'toast-error',
    info: 'toast-info',
    success: 'toast-success',
    warning: 'toast-warning'
  }

}),importProvidersFrom(NgxSpinnerModule,TimeagoModule.forRoot(),ModalModule.forRoot(), ReactiveFormsModule)
  ]
};
