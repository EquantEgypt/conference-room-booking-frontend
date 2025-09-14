import { CanActivate, Router } from '@angular/router';
import { TOKEN } from '../core/services/authentication/authentication.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class NoAuthGuard implements CanActivate {
  constructor(private router: Router) { }

  canActivate(): boolean {

    const isLoggedIn = sessionStorage.getItem(TOKEN) !== null;

    if(isLoggedIn){
        //  already logged in → redirect to dashboard
        this.router.navigate(['dashboard']); 
        return false;
      }
      return true; // not logged in → allow access
  }
};
