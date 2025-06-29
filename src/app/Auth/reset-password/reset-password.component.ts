import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../../_services/account.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  imports: [NgIf, ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit {
  email = '';
  token = '';
  isSubmitting = false;
 private fb=inject( FormBuilder);
    private route=inject (ActivatedRoute);
    private accountService= inject( AccountService);
    private toastr=inject( ToastrService);
    private router=inject(Router);

  resetForm = this.fb.group({
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  });

 
  
   ngOnInit(): void {
    this.email = this.route.snapshot.queryParamMap.get('email') ?? '';
    this.token = this.route.snapshot.queryParamMap.get('token') ?? '';
  }

  resetPassword() {
    if (this.resetForm.invalid || this.passwordMismatch()) {
      this.toastr.error('تأكد من إدخال كلمة مرور صحيحة وتأكيدها');
      return;
    }

    this.isSubmitting = true;

    const model = {
      email: this.email,
      token: this.token,
      newPassword: this.resetForm.value.newPassword!
    };

    this.accountService.resetPassword(model).subscribe({
      next: () => {
        this.toastr.success('تم إعادة تعيين كلمة المرور بنجاح');
        this.router.navigateByUrl('/reset-success');
      },
      error: err => {
        this.toastr.error('حدث خطأ أثناء إعادة تعيين كلمة المرور');
        this.isSubmitting = false;
      }
    });
  }

  passwordMismatch(): boolean {
    return this.resetForm.value.newPassword !== this.resetForm.value.confirmPassword;
  }
}
