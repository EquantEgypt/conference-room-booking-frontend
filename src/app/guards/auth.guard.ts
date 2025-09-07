import { CanActivate, Router } from '@angular/router';
import { TOKEN } from '../core/services/authentication/authentication.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
  constructor(private router: Router) { }

  canActivate(): boolean {

    const isLoggedIn = sessionStorage.getItem(TOKEN) !== null;

    if (isLoggedIn) return true;
    this.router.navigate(['login']);
    return false;
  }
};
