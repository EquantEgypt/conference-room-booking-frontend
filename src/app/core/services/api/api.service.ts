import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserCredentials } from '../../models/user-credentials';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  login(userCredentials: UserCredentials): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, userCredentials, { observe: 'response' });
  }
}
