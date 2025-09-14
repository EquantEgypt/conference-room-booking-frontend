import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = 'http://localhost:8080/api/bookings';

  constructor(private http: HttpClient) {}

  getAvailableRooms(): Observable<any> {
    return this.http.get(`${this.apiUrl}/rooms`);
  }

  createBooking(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }
}
