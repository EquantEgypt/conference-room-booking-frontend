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
        if (response && response.token) {
          sessionStorage.setItem(TOKEN, response.token);
        }
      }),
      catchError((error) => {
        return throwError(() => error);
      }))
  }
}
