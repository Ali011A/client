import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { trigger, transition, style, animate, keyframes,state } from '@angular/animations';

@Component({
  selector: 'app-error-page',
  imports: [CommonModule],
  templateUrl: './error-page.component.html',
  styleUrl: './error-page.component.css',
   animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateY(50px)', opacity: 0 }),
        animate('0.6s ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.8s 0.3s ease-out', style({ opacity: 1 }))
      ])
    ]),
    trigger('pulse', [
      state('active', style({ transform: 'scale(1)' })),
      transition('* => active', [
        animate('2s ease-in-out', keyframes([
          style({ transform: 'scale(1)', offset: 0 }),
          style({ transform: 'scale(1.1)', offset: 0.5 }),
          style({ transform: 'scale(1)', offset: 1 })
        ]))
      ]),
      transition('active => active', [
        animate('2s ease-in-out', keyframes([
          style({ transform: 'scale(1)', offset: 0 }),
          style({ transform: 'scale(1.1)', offset: 0.5 }),
          style({ transform: 'scale(1)', offset: 1 })
        ]))
      ])
    ]),
    trigger('heartFloat', [
      state('floating', style({ transform: 'translateY(0px) rotate(0deg)', opacity: 0.7 })),
      transition('* => floating', [
        animate('3s ease-in-out', keyframes([
          style({ transform: 'translateY(0px) rotate(0deg)', opacity: 0.7, offset: 0 }),
          style({ transform: 'translateY(-20px) rotate(5deg)', opacity: 1, offset: 0.5 }),
          style({ transform: 'translateY(0px) rotate(0deg)', opacity: 0.7, offset: 1 })
        ]))
      ]),
      transition('floating => floating', [
        animate('3s ease-in-out', keyframes([
          style({ transform: 'translateY(0px) rotate(0deg)', opacity: 0.7, offset: 0 }),
          style({ transform: 'translateY(-20px) rotate(5deg)', opacity: 1, offset: 0.5 }),
          style({ transform: 'translateY(0px) rotate(0deg)', opacity: 0.7, offset: 1 })
        ]))
      ])
    ])
  ]
})
export class ErrorPageComponent implements OnInit {
  @Input() errorType: 'not-found' | 'server-error' = 'not-found';
  floatingState = 'floating';
  pulseState = 'active';
  constructor(private router: Router) {}

  ngOnInit() {}

  getTitle(): string {
    switch (this.errorType) {
      case 'not-found':
        return 'عذراً، لم نجد ما تبحث عنه! 💔';
      case 'server-error':
        return 'عطل مؤقت في الخدمة! ⚡';
      default:
        return 'حدث خطأ!';
    }
  }

  getSubtitle(): string {
    switch (this.errorType) {
      case 'not-found':
        return 'الصفحة التي تبحث عنها غير موجودة';
      case 'server-error':
        return 'نعمل على إصلاح المشكلة';
      default:
        return '';
    }
  }

  getDescription(): string {
    switch (this.errorType) {
      case 'not-found':
        return 'لا تقلق، الحب يحتاج وقت للعثور عليه. لنساعدك في العثور على المكان المناسب!';
      case 'server-error':
        return 'خوادمنا تواجه مشكلة مؤقتة. سنعود قريباً لمساعدتك في العثور على شريك حياتك!';
      default:
        return '';
    }
  }

  goHome(): void {
    this.router.navigate(['/']);
  }

  goBack(): void {
    window.history.back();
  }

  retry(): void {
    window.location.reload();
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

}
