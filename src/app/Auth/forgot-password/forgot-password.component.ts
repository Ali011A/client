import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountService } from '../../_services/account.service';
import { ToastrService } from 'ngx-toastr';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  imports: [NgIf, ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
 private fb = inject(FormBuilder);
  private accountService = inject(AccountService);
  private toastr = inject(ToastrService);

  isSubmitting = false;
  emailSent = false;

  forgotForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  submit() {
    if (this.forgotForm.invalid) return;

    this.isSubmitting = true;

    const email = this.forgotForm.get('email')?.value;
    if (typeof email !== 'string') {
      this.toastr.error('يرجى إدخال بريد إلكتروني صحيح.');
      this.isSubmitting = false;
      return;
    }
    this.accountService.forgotPassword({ email }).subscribe({
      next: () => {
        this.emailSent = true;
        this.toastr.success('📩 تم إرسال رابط إعادة تعيين كلمة المرور إذا كان البريد صحيح.');
        this.isSubmitting = false;
      },
      error: () => {
        this.toastr.error('حدث خطأ أثناء إرسال الرابط.');
        this.isSubmitting = false;
      }
    });
  }
}  

