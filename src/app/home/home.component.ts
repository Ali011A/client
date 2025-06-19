import { User } from './../_models/user';
import { NgIf } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { RegisterComponent } from "../register/register.component";
import { HttpClient } from '@angular/common/http';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-home',
  imports: [FormsModule, NgIf, RegisterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent  implements OnInit, OnDestroy {
// registerMode = false;
// toggleRegisterMode() {
//   this.registerMode = !this.registerMode;
// }
  registerMode: boolean = false;
  private particleInterval: any;
  private heartInterval: any;
    private accountService=inject(AccountService);
  users: any;
   model:any={};
  http=inject(HttpClient);
  getUsers() {
   this.http.get('https://localhost:7202/api/users').subscribe({
      next: (response) => {
        this.users = response;
   
      },
      error: (error) => {
        console.error('Error fetching users:', error);
      },
      complete: () => {
        console.log('User fetch completed');
      }
    });
  }
  // Form data
  registrationForm = {
    name: '',
    email: '',
    age: null
  };

  ngOnInit(): void {
    this.createParticles();
   // this.getUsers();
    // this.startHeartAnimation();
  }

  ngOnDestroy(): void {
    if (this.particleInterval) {
      clearInterval(this.particleInterval);
    }
    if (this.heartInterval) {
      clearInterval(this.heartInterval);
    }
  }

  toggleMode(): void {
    this.registerMode = !this.registerMode;
  }

  showWelcomeMode(): void {
    this.registerMode = false;
  }

  showRegisterMode(): void {
    this.registerMode = true;
  }

  showLearnMore(): void {
    alert('مرحباً بك في تطبيق المواعدة الأكثر أماناً وموثوقية! انضم إلينا اليوم واكتشف عالماً من الفرص للعثور على الحب الحقيقي.');
  }

  // submitRegistration(): void {
  //   if (this.model.username && this.registrationForm.passw && this.registrationForm.age) {
  //     this.createHeartAnimation();
  //     alert(`مرحباً ${this.registrationForm.name}! تم تسجيلك بنجاح. مرحباً بك في عائلتنا! 💖`);
  //     // Reset form
  //     this.registrationForm = { name: '', email: '', age: null };
  //   } else {
  //     alert('يرجى ملء جميع الحقول المطلوبة.');
  //   }
  // }

  private createParticles(): void {
    const particlesContainer = document.getElementById('particles');
    if (particlesContainer) {
      for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (3 + Math.random() * 3) + 's';
        particlesContainer.appendChild(particle);
      }
    }
  }

  // private createHeartAnimation(): void {
  //   const heart = document.createElement('div');
  //   heart.innerHTML = '<i class="fas fa-heart"></i>';
  //   heart.className = 'heart-animation';
  //   heart.style.left = Math.random() * window.innerWidth + 'px';
  //   heart.style.top = window.innerHeight + 'px';
  //   heart.style.fontSize = '2rem';
  //   document.body.appendChild(heart);

  //   setTimeout(() => {
  //     if (document.body.contains(heart)) {
  //       document.body.removeChild(heart);
  //     }
  //   }, 3000);
  // }

  // private startHeartAnimation(): void {
  //   this.heartInterval = setInterval(() => {
  //     if (Math.random() > 0.7) {
  //       this.createHeartAnimation();
  //     }
  //   }, 3000);
  // }

  onButtonClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (target.classList.contains('btn')) {
      const ripple = document.createElement('div');
      ripple.style.position = 'absolute';
      ripple.style.borderRadius = '50%';
      ripple.style.background = 'rgba(255, 255, 255, 0.6)';
      ripple.style.transform = 'scale(0)';
      ripple.style.animation = 'ripple 0.6s linear';

      const rect = target.getBoundingClientRect();
      const clickEvent = event as MouseEvent;
      ripple.style.left = (clickEvent.clientX - rect.left) + 'px';
      ripple.style.top = (clickEvent.clientY - rect.top) + 'px';
      ripple.style.width = ripple.style.height = '20px';

      target.appendChild(ripple);

      setTimeout(() => {
        if (ripple.parentNode) {
          ripple.parentNode.removeChild(ripple);
        }
      }, 600);
    }
  }
}
