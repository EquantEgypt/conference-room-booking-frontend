import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserCredentials } from '../../models/user-credentials';
import { EMPTY, Observable } from 'rxjs';
import { FilterRequest } from '../../models/filter-request';
import { ReservationRequest } from '../../models/reservation-request';
import { MyBookingFilter } from '../../models/my-booking-filter';

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

getReservationByFilters(params: MyBookingFilter | null) {
  console.log(params);

  let httpParams = new HttpParams();

  if (params) {
    if (params.dateScope && params.dateScope !== 'ALL') {
      httpParams = httpParams.set('dateScope', params.dateScope.toString());
    }

    if (params.recurrenceOption && params.recurrenceOption !== 'ALL') {
      httpParams = httpParams.set('recurrenceOption', params.recurrenceOption);
    }

    if (params.reservationType && params.reservationType !== 'ALL') {
      httpParams = httpParams.set('reservationType', params.reservationType);
    }

    // ✅ Send the correct backend parameters
    httpParams = httpParams.set('isManager', params.isManager ? 'true' : 'false');

    if (params.managerView) {
      httpParams = httpParams.set('managerView', params.managerView);
    }
  }

  return this.http.get(`${this.apiUrl}/reserve/filter`, {
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

  getAllReservationsForAdmin(): Observable<any> {
    return this.http.get(`${this.apiUrl}/reserve/all`, { observe: 'response' });  
  }




  getEquipments(): Observable<any> {
    return this.http.get(`${this.apiUrl}/equipment`, { observe: 'response' });
  }

  sendReservation(requestBody: ReservationRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/reserve`, requestBody, { observe: 'response' });
  }

  getcalendarViewDate(date: Date): Observable<any> {
    date = new Date(date);
    const formattedDate = date.toISOString().split('T')[0];
    return this.http.get(`${this.apiUrl}/reserve/date/${formattedDate}`, { observe: 'response' });
  }


  getReservationById(reservationId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/reserve/${reservationId}`, { observe: 'response' });
  }

  deleteReservation(reservationId: number) {
    return this.http.delete(`${this.apiUrl}/reserve/${reservationId}`);
  }

  updateReservation(reservationId: number, requestBody: ReservationRequest): Observable<any> {
    return this.http.put(`${this.apiUrl}/reserve/${reservationId}`, requestBody, { observe: 'response' });
  }

  getUserInfo(): Observable<any> {
    return this.http.get(`${this.apiUrl}/username`, { observe: 'response' });
  }

  getReservationsByDate(startDate: string, endDate: string): Observable<any> {
  return this.http.get(`${this.apiUrl}/reserve/calendar`, {
    params: { startDate, endDate },
    observe: 'response'
  });


}


  getUpcomingReservations(): Observable<any> {
    return this.http.get(`${this.apiUrl}/reserve/up-coming`, { observe: 'response' });
  }

}

