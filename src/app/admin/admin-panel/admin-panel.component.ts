import { Component } from '@angular/core';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { UserMangementComponent } from '../user-mangement/user-mangement.component';
import { PhotoMangementComponent } from '../photo-mangement/photo-mangement.component';
import { HasRoleDirective } from '../../_directives/has-role.directive';

@Component({
  selector: 'app-admin-panel',
  imports: [TabsModule,UserMangementComponent,PhotoMangementComponent,HasRoleDirective],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.css'
})
export class AdminPanelComponent {

}
