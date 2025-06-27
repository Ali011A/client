import { inject, Injectable } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { map } from 'rxjs';
import { ConfirmDialogComponent } from '../modals/confirm-dialog/confirm-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class ConfirmService {

  bsModelRef?:BsModalRef;
  private modalSevices=inject(BsModalService);
 confirm(
  title='Confirmation',
  message='Are you sure you want to do this?',
  btnOkText='Ok',
  btnCancelText='Cancel'

 ){
  const config:ModalOptions={
    initialState:{
      title,
      message,
      btnOkText,
      btnCancelText
    }
  };
this.bsModelRef=this.modalSevices.show(ConfirmDialogComponent,config);
return this.bsModelRef.onHidden?.pipe(
  map(()=>{
    if(this.bsModelRef?.content){
      return this.bsModelRef.content.result;
    }else return false;
  })
)
 }
}
