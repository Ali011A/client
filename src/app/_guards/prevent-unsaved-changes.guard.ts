import { CanDeactivateFn } from '@angular/router';
import { MemberEditComponent } from '../members/member-edit/member-edit.component';

export const preventUnsavedChangesGuard: CanDeactivateFn<MemberEditComponent> = (component) => {
  
  if (component.editForm?.dirty) {
    return confirm('هل أنت متأكد أنك تريد مغادرة هذه الصفحة؟ التغييرات التي أجريتها قد لا تحفظ.');
  }
  return true;
};
