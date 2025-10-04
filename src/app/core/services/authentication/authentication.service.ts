import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { UserCredentials } from '../../models/user-credentials';
import { catchError, tap, throwError } from 'rxjs';


export const TOKEN = 'token';

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService { 
  constructor(private api: ApiService) { }

  authenticate(userCredentials: UserCredentials) {
    return this.api.login(userCredentials).pipe(
      tap((response) => {
          // unnecessary logic removed
      }),
      catchError((error) => {
        return throwError(() => error);
      }))
  }

  getCurrentUser() {
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
}

}
