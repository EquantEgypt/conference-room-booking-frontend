import { Component } from '@angular/core';
import { ApiService } from '../core/services/api/api.service';
import {convertToReservationList, ReservationResponse } from '../core/models/reservation-response';

@Component({
  selector: 'app-my-booking',
  standalone: true,
  imports: [],
  templateUrl: './my-booking.component.html',
  styleUrl: './my-booking.component.css'
})

export class MyBookingComponent {
  // reservations: ReservationResponse[] = [];
  // startDates: Date[] | null = null

  // constructor(private api: ApiService) {}

  // ngOnInit() {
  //   this.fetchAllReservation();
  // }

  // fetchAllReservation() {
  //   this.api.getReservation().subscribe({
  //     next: (response) => {
  //       console.log(response.body);

  //       this.startDates = this.reservations
  //         .filter(r => r.startTime !== null) 
  //         .map(r => new Date(r.startTime!));

  //       this.reservations = convertToReservationList(response.body);
  //       console.log(this.reservations);
  //     },
  //     error: (err) => {
  //       console.log(err);
  //     }
  //   });
  // }
}
