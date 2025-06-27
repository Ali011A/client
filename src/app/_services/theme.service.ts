import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
 private darkModeSignal = signal<boolean>(this.loadFromLocalStorage());

  isDarkMode = this.darkModeSignal.asReadonly();

  toggleDarkMode() {
    const newValue = !this.darkModeSignal();
    this.darkModeSignal.set(newValue);
    this.saveToLocalStorage(newValue);
    this.updateBodyClass(newValue);
  }

  private updateBodyClass(isDark: boolean) {
    const body = document.querySelector('body');
    if (!body) return;
    body.classList.toggle('dark-mode', isDark);
  }

  private saveToLocalStorage(value: boolean) {
    localStorage.setItem('darkMode', JSON.stringify(value));
  }

  private loadFromLocalStorage(): boolean {
    const val = localStorage.getItem('darkMode');
    const parsed = val ? JSON.parse(val) : false;
    // عند بدء التشغيل نطبقه تلقائيًا
    this.updateBodyClass(parsed);
    return parsed;
  }
}
