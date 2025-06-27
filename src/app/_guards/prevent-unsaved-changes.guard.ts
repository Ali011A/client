import { CanDeactivateFn } from '@angular/router';
import { MemberEditComponent } from '../members/member-edit/member-edit.component';
import { inject } from '@angular/core';
import { ConfirmService } from '../_services/confirm.service';

export const preventUnsavedChangesGuard: CanDeactivateFn<MemberEditComponent> = (component) => {
  const confirmService=inject(ConfirmService);
  if (component.editForm?.dirty) {
   // return confirm('هل أنت متأكد أنك تريد مغادرة هذه الصفحة؟ التغييرات التي أجريتها قد لا تحفظ');
   return confirmService.confirm()??false;
  }
  return true;
};
