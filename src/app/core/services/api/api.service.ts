import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserCredentials } from '../../models/user-credentials';
import { Observable } from 'rxjs';
import { FilterRequest } from '../../models/filter-request';
import { ReservationRequest } from '../../models/reservation-request';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  login(userCredentials: UserCredentials): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, userCredentials, { observe: 'response' });
  }

  getRooms(params: FilterRequest | null) {

    console.log(params);

    let httpParams = new HttpParams();

    if (params) {
      if (params.date) {
        httpParams = httpParams.set('date', params.date.toString());
      }
      if (params.startTime) {
        httpParams = httpParams.set('startTime', params.startTime);
      }
      if (params.endTime) {
        httpParams = httpParams.set('endTime', params.endTime);
      }
      if (params.capacity !== null) {
        httpParams = httpParams.set('capacity', params.capacity.toString());
      }
      if (params.equipmentTypes && params.equipmentTypes.length > 0) {
        // convert equipment types array to comma-separated string
        httpParams = httpParams.set('equipmentTypes', params.equipmentTypes.join(','));
      }
    }

    return this.http.get(`${this.apiUrl}/rooms`, {
      observe: 'response',
      params: httpParams
    });
  }

  getRoom(roomId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/rooms/${roomId}`, { observe: 'response' });
  }

  getAllReservations(): Observable<any> {
    return this.http.get(`${this.apiUrl}/reserve`, { observe: 'response' });
  }

  getEquipments(): Observable<any> {
    return this.http.get(`${this.apiUrl}/equipment`, { observe: 'response' });
  }

  sendReservation(requestBody: ReservationRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/reserve`, requestBody, { observe: 'response' });
  }
  
  getReservationById(reservationId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/reserve/${reservationId}`);
  }

  deleteReservation(reservationId: number) {
    return this.http.delete(`${this.apiUrl}/reserve/${reservationId}`);
  }


}