import { Component, inject, input, OnInit, output } from '@angular/core';
import { Member } from '../../_models/member';
import { DecimalPipe, NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { FileUploader, FileUploadModule } from 'ng2-file-upload';
import { AccountService } from '../../_services/account.service';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-photo-editor',
  imports: [NgIf,NgFor,NgStyle,NgClass,FileUploadModule,DecimalPipe],
  templateUrl: './photo-editor.component.html',
  styleUrl: './photo-editor.component.css'
})
export class PhotoEditorComponent implements OnInit {
  private accountService=inject(AccountService);
member=input.required<Member>();
uploader?:FileUploader;
  hasBaseDropZoneOver = false;
  hasAnotherDropZoneOver = false;
baseUrl=environment.apiUrl;
memberChange=output<Member>();
  ngOnInit(): void {
   this.initializeUploader();
  }

fileOverBase(e: any): void {
  this.hasBaseDropZoneOver = e;
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
        const updatedMember= { ...this.member(), photos: [...this.member().photos, res] };
        this.memberChange.emit(updatedMember);
      }
    };
  }

  // fileOverBase(e: any): void {
  //   this.hasBaseDropZoneOver = e;
  // }

  // fileOverAnother(e: any): void {
  //   this.hasAnotherDropZoneOver = e;
  // }
}
