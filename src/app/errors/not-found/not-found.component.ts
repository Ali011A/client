import { Component } from '@angular/core';
import { ErrorPageComponent } from '../error-page/error-page.component';


@Component({
  selector: 'app-not-found',
  imports: [ErrorPageComponent],
  template: `<app-error-page errorType="not-found"></app-error-page>`
  
  
})
export class NotFoundComponent {

}
