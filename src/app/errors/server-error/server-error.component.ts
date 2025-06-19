import { Component } from '@angular/core';
import { ErrorPageComponent } from '../error-page/error-page.component';
@Component({
  selector: 'app-server-error',
  imports: [ErrorPageComponent],
  template: `<app-error-page errorType="server-error"></app-error-page>`
})
export class ServerErrorComponent {

}
