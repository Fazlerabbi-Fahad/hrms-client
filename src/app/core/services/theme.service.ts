import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly storageKey = 'hrms_theme';
  readonly isDark = signal(false);

  constructor() {
    this.initializeTheme();
  }

  toggle(): void {
    const nextMode = this.isDark() ? 'light' : 'dark';
    this.setTheme(nextMode);
  }
  setTheme(mode: 'light' | 'dark'): void {
    const isDarkMode = mode === 'dark';
    document.documentElement.classList.toggle('dark', isDarkMode);
    this.isDark.set(isDarkMode);
    localStorage.setItem(this.storageKey, mode);
  }
  initializeTheme(): void {
    const savedTheme = localStorage.getItem(this.storageKey) as
      | 'light'
      | 'dark'
      | null;
    const preferredDark = window.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches;
    const initialMode = savedTheme ?? (preferredDark ? 'dark' : 'light');
    this.setTheme(initialMode);
  }
}
