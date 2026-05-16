import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthUser, LoginRequest, LoginResponse } from '../models/auth.model';
import { map, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
   private readonly STORAGE_KEY = 'hrms_user';

  currentUser = signal<AuthUser | null>(null);

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      const user = JSON.parse(stored) as AuthUser;
      if (!this.isTokenExpired(user.expiresAt)) {
        this.currentUser.set(user);
      } else {
        localStorage.removeItem(this.STORAGE_KEY);
      }
    }
  }

  login(request: LoginRequest): Observable<AuthUser> {
    return this.http
      .post<LoginResponse>(`${environment.apiUrl}/Auth/login`, request)
      .pipe(
        map((response) => response.data),
        tap((user: AuthUser) => {
          this.currentUser.set(user);
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
        }),
      );
  }

  logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string {
    return this.currentUser()?.token ?? '';
  }

  getCurrentUser(): AuthUser | null {
      return this.currentUser();
  }

  isLoggedIn(): boolean {
    const user = this.currentUser();
    return !!user && !this.isTokenExpired(user.expiresAt);
  }

  hasRole(role: string): boolean {
    return this.currentUser()?.roles.includes(role) ?? false;
  }

  private isTokenExpired(expiresAt: string): boolean {
    return new Date(expiresAt) <= new Date();
  }
}
