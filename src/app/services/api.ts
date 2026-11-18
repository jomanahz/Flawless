import { Injectable } from '@angular/core';

const API_URL = 'https://flawless-backend-hugx.onrender.com/api';

export interface AppUser {
  id: number;
  name: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  get token(): string | null {
    try { return localStorage.getItem('flawless_token'); } catch { return null; }
  }

  get user(): AppUser | null {
    try {
      const raw = localStorage.getItem('flawless_user');
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  }

  get isLoggedIn(): boolean {
    return !!this.token;
  }

  logout(): void {
    try {
      localStorage.removeItem('flawless_token');
      localStorage.removeItem('flawless_user');
    } catch {}
  }

  async register(name: string, email: string, password: string): Promise<AppUser> {
    const data = await this.post('/auth/register', { name, email, password });
    return data.user;
  }

  async login(email: string, password: string): Promise<AppUser> {
    const data = await this.post('/auth/login', { email, password });
    try {
      localStorage.setItem('flawless_token', data.token);
      localStorage.setItem('flawless_user', JSON.stringify(data.user));
    } catch {}
    return data.user;
  }

  private async post(path: string, body: unknown): Promise<any> {
    let res: Response;
    try {
      res = await fetch(API_URL + path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
    } catch {
      throw new Error('Cannot reach the server. Please try again in a minute.');
    }
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.success === false) {
      throw new Error(data.message || 'Something went wrong');
    }
    return data;
  }
}
