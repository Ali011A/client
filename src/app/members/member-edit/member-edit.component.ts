import { Component, HostListener, inject, OnInit, output, ViewChild } from '@angular/core';
import { Member } from '../../_models/member';
import { AccountService } from '../../_services/account.service';
import { MembersService } from '../../_services/members.service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule, NgForm } from '@angular/forms';
import { DatePipe, DecimalPipe, NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { FileUploader, FileUploadModule } from 'ng2-file-upload';
import { environment } from '../../../environments/environment';
import { Photo } from '../../_models/photo';
import { User } from '../../_models/user';
import { TimeagoModule } from 'ngx-timeago';

@Component({
  selector: 'app-member-edit',

  imports: [FormsModule,NgIf,NgFor,NgStyle,NgClass,FileUploadModule,DecimalPipe,TimeagoModule,DatePipe],
  templateUrl: './member-edit.component.html',
  styleUrl: './member-edit.component.css'
})
export class MemberEditComponent implements OnInit {
  @ViewChild('editForm') editForm?:NgForm
@HostListener('window:beforeunload', ['$event'])notfiy($event:any){
  if (this.editForm?.dirty) {
    $event.returnValue = true; // This will prompt the user with a confirmation dialog
  }
}
  member?:Member;
private accountService= inject(AccountService);
private memberService = inject(MembersService);
private toastr = inject(ToastrService);
uploader?:FileUploader;
  hasBaseDropZoneOver = false;
  hasAnotherDropZoneOver = false;
baseUrl=environment.apiUrl;
memberChange=output<Member>();
  ngOnInit(): void {
    this.loadMember();
    this.initializeUploader();
  }

  loadMember() {
    const user = this.accountService.currentUser();

    if (user) {
      this.memberService.getMember(user.username ? user.username : '').subscribe({
        next: (response) => {
          this.member = response;
          console.log('Member loaded:', response);
        },
        error: (error) => {
          console.error('Error loading member:', error);
        }
      });
    } else {
      console.error('No current user found');
    }
  }
fileOverBase(e: any): void {
  this.hasBaseDropZoneOver = e;
}
setMainPhoto(photo: Photo) {
  this.memberService.setMainPhoto(photo).subscribe({
    next: () => {
      if (this.member) {
        // تحديث بيانات الصور في العضو الحالي
        this.member.photos.forEach(p => {
          p.isMain = false;
        });

        const foundPhoto = this.member.photos.find(p => p.id === photo.id);
        if (foundPhoto) {
          foundPhoto.isMain = true;

          // الحصول على المستخدم الحالي
          const currentUser = this.accountService.currentUser();

          if (currentUser) {
            // تحديث currentUser مع الحفاظ على النوع User
            const updatedUser: User = {
              ...currentUser,
              photoUrl: photo.url
            };

            // حفظ التحديث في localStorage و signal
            localStorage.setItem('user', JSON.stringify(updatedUser));
            this.accountService.currentUser.set(updatedUser);
          }

          this.toastr.success('Photo set as main successfully');
        }
      }

      this.loadMember(); // إعادة تحميل العضو لتحديث الصور
    },
    error: (error) => {
      console.error('Error setting main photo:', error);
      this.toastr.error('Failed to set main photo');
    }
  });
}
  deletePhoto(photoId: number) {
    this.memberService.deletePhoto(photoId).subscribe({
      next: () => {
        if (this.member) {
          this.member.photos = this.member.photos.filter(p => p.id !== photoId);
          this.toastr.success('Photo deleted successfully');

          // إذا كانت الصورة المحذوفة هي الصورة الرئيسية، نقوم بتحديث المستخدم الحالي
          const currentUser = this.accountService.currentUser();
          if (currentUser && currentUser.photoUrl === this.member.photos[0]?.url) {
            const updatedUser: User = {
              ...currentUser,
              photoUrl: this.member.photos.length > 0 ? this.member.photos[0].url : ''
            };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            this.accountService.currentUser.set(updatedUser);
          }
        }
      },
      error: (error) => {
        console.error('Error deleting photo:', error);
        this.toastr.error('Failed to delete photo');
      }
    });
  }


  initializeUploader() {
    this.uploader = new FileUploader({
      url: this.baseUrl + 'users/add-photo',
      authToken: `Bearer ${this.accountService.currentUser()?.token}`,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024 // 10 MB
    });

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };

  this.uploader.onSuccessItem = (item, response, status, headers) => {
  if (response) {
    const res: any = JSON.parse(response);

    // إضافة الصورة إلى قائمة الصور
    this.member?.photos.push(res);

    // إذا كانت أول صورة أو رئيسية، نحدث الصورة في navbar
    if (this.member?.photos.length === 1 || res.isMain) {
      const currentUser = this.accountService.currentUser();
      if (currentUser) {
        const updatedUser: User = {
          ...currentUser,
          photoUrl: res.url
        };

        localStorage.setItem('user', JSON.stringify(updatedUser));
        this.accountService.currentUser.set(updatedUser);
      }
    }
  }
};
  }
  updateMember() {

      this.memberService.updateMember(this.editForm?.value).subscribe({
        next: _  => {
          this.toastr.success('Profile updated successfully');
          this.editForm?.reset(this.member);
        },
        error: (error) => {
          console.error('Error updating member:', error);
          this.toastr.error('Failed to update profile');
        }
      });

  }
  onMemberChange(event:Member){
    this.member = event;
    //console.log('Member changed:', this.member);
  }




}
