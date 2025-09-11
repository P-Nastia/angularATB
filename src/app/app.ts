import {Component, computed, signal} from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {jwtDecode} from 'jwt-decode';
import {environment} from '../environments/environment';
import {NgIf} from '@angular/common';

export interface JwtToken {
  email: string;
  name: string;
  image: string;
  roles: string[];
  exp: number;
  iat: number;
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink,NgIf],
  templateUrl: './app.html',
  styleUrl: './app.css',
  standalone: true
})

export class App {
  private readonly token = signal<string | null>(localStorage.getItem('token'));

  protected readonly user = computed<JwtToken | null>(() => {
    const value = this.token();
    if (!value) return null;

    try {
      return jwtDecode<JwtToken>(value);
    } catch (e) {
      console.error('Invalid token:', e);
      return null;
    }
  });

  protected readonly isLoggedIn = computed(() => {
    const u = this.user();
    if (!u) return false;
    const now = Date.now() / 1000;
    return u.exp > now;
  });


  public logout(): void {
    localStorage.removeItem('token');
    this.token.set(null);
  }

  protected readonly environment = environment;
}
