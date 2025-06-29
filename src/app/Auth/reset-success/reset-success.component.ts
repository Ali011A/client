import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-success',
  imports: [],
  templateUrl: './reset-success.component.html',
  styleUrl: './reset-success.component.css'
})
export class ResetSuccessComponent  implements  OnInit {
private router=inject(Router);
  countdown = 5;
  
   ngOnInit(): void {
    const interval = setInterval(() => {
      this.countdown--;
      if (this.countdown === 0) {
        clearInterval(interval);
        this.router.navigate(['/']);
      }
    }, 1000);
  }
}
