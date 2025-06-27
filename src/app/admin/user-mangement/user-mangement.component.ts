import { Component, inject, OnInit } from '@angular/core';
import { AdminService } from '../../_services/admin.service';
import { User } from '../../_models/user';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { RolesModalComponent } from '../../modals/roles-modal/roles-modal.component';

@Component({
  selector: 'app-user-mangement',
  imports: [],
  templateUrl: './user-mangement.component.html',
  styleUrl: './user-mangement.component.css'
})
export class UserMangementComponent implements OnInit {
private adminService=inject(AdminService);
private modalService=inject(BsModalService);
users: User[]=[];
bsModalRef:BsModalRef<RolesModalComponent>=new BsModalRef<RolesModalComponent>();
ngOnInit(): void {
   this.getUserWithRoles(); 
}
// openRolesModal(user:User){
//   const initalState:ModalOptions={
//     class:'modal-dialog-centered',
//     initialState:{
//       title:'User Roles',
//       username:user.username,
//       selectedRoles:[...user.roles],
//       avilableRoles:['Admin','Moderator','Member'],
//       users:this.users,
//       rolesUpdated:false
    
//     }
//   }
//   this.bsModalRef=this.modalService.show(RolesModalComponent,initalState);
//   this.bsModalRef.onHide?.subscribe({
//     next:()=>{
//       if(this.bsModalRef.content && this.bsModalRef.content.rolesUpdated){
//         const selectedRoles=this.bsModalRef.content.selectedRoles;
//         this.adminService.updateUserRoles(user.username!,selectedRoles).subscribe(
//           {
//             next:roles=>user.roles=roles
//           }
//         )
//       }
//     }
//   })
// }
  openRolesModal(user: User) {
    const initialState: ModalOptions = {
      class: 'modal-dialog-centered',
      initialState: {
        title: 'User Roles',
        username: user.username ?? '',
        selectedRoles: [...user.roles],
        availableRoles: ['Admin', 'Moderator', 'Member'],
        rolesUpdated: false
      }
    };

    this.bsModalRef = this.modalService.show(RolesModalComponent, initialState);

    this.bsModalRef.onHide?.subscribe(() => {
      if (this.bsModalRef.content?.rolesUpdated) {
        const updatedRoles = this.bsModalRef.content.selectedRoles;
        this.adminService.updateUserRoles(user.username!, updatedRoles).subscribe({
          next: roles => user.roles = roles
        });
      }
    });
  }
getUserWithRoles(){
  this.adminService.getUserWithRoles().subscribe(
    {
      next:users=>this.users= users
    }
  );
}
}
