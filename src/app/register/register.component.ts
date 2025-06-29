import { Component, inject, Input, OnInit} from '@angular/core';
import {  AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { AccountService } from '../_services/account.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { JsonPipe, NgIf } from '@angular/common';
import { DatePickerComponent } from '../_forms/date-picker/date-picker.component';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule,NgIf,DatePickerComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  private accountService=inject(AccountService);
@Input() userFromHomeComponent: any;
  model:any={}
  registerForm:FormGroup = new FormGroup({});
  // You can define the form controls and validation here if needed
maxDate=new Date()
private toaster=inject(ToastrService);
  private router=inject(Router);

  ngOnInit(): void {
      this.initializeForm();
     this.maxDate.setFullYear(this.maxDate.getFullYear()-18)

  }
  initializeForm(){
    this.registerForm = new FormGroup({
      gender: new FormControl('male'),
      username: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      knownAs:new FormControl('',[Validators.required]),
      dateOfBirth:new FormControl('',[Validators.required]),
      city:new FormControl('',[Validators.required]),
      country:new FormControl('',[Validators.required]),
      password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
     Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{6,}')
    ]),
      confirmPassword: new FormControl('', [Validators.required, this.matchValues('password')])
      // Add other form controls as needed
    });
    this.registerForm.controls['password'].valueChanges.subscribe(() => {
      this.registerForm.controls['confirmPassword'].updateValueAndValidity();
    });
      this.registerForm.valueChanges.subscribe(() => {
      this.registerForm.markAllAsTouched();
    });
  }

  matchValues(matchTo:string):ValidatorFn{
    return (control:AbstractControl)=>{
      return control.value === control.parent?.get(matchTo)?.value ? null : {mismatch: true};
    }
  }
register() {


 if (this.registerForm.invalid) return;

  const formValue = this.registerForm.value;
  // Here you would typically call a service to handle the registration logic
 this.accountService.register(formValue).subscribe({

   next: (response) => {
     //console.log('Registration successful:', response);
 this.router.navigateByUrl('/members');
    this.toaster.success(`مرحباً ${formValue.username}! تم تسجيلك بنجاح. 💖`);
   

   },
    error: (error) => {
     console.error('Registration failed:', error);
     this.toaster.error(error.error);
     this.router.navigateByUrl('/register');
    //  Optionally, you can display an error message to the user
      alert('Registration failed. Please try again.');
   }
 });
}
cancel()
{
  console.log('Registration cancelled');
  // Here you can handle the cancellation logic, such as navigating back or resetting the form
  // For example:
  // this.router.navigate(['/home']);
}

}
