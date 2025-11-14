// src/app/services/auth.service.ts
import { Injectable, signal } from '@angular/core';

export interface User {
  name: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _user = signal<User | null>(this.loadUser());
  readonly user = this._user.asReadonly();

  private loadUser(): User | null {
    const raw = localStorage.getItem('ecart_user');
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  }

  login(user: User): void {
    this._user.set(user);
    localStorage.setItem('ecart_user', JSON.stringify(user));
  }

  logout(): void {
    this._user.set(null);
    localStorage.removeItem('ecart_user');
  }
}
