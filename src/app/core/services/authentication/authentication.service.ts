import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { UserCredentials } from '../../models/user-credentials';
import { catchError, tap, throwError } from 'rxjs';


export const TOKEN = 'token';

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService { // TODO: This service may be removed later if it remains unused or redundant.

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
}
