import { Component, OnInit } from '@angular/core';
import { ApiService } from '../core/services/api/api.service';
import { convertToReservationList, ReservationResponse } from '../core/models/reservation-response';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MyBookingFilter } from '../core/models/my-booking-filter';
import { DateScope } from '../core/enum/date-scope';
import { RecurrenceOption } from '../core/enum/recurrence-option';
import { ReservationType } from '../core/enum/reservation-type';
import { ReservationResponseList } from '../core/models/reservation-response-list';

@Component({
  selector: 'app-my-booking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './my-booking.component.html',
  styleUrls: ['./my-booking.component.css']
})

export class MyBookingComponent implements OnInit {
  DateScope = DateScope;
  isLoading = false;
  filteredReservations: ReservationResponseList[] = [];
  dateScopeFilter: DateScope = DateScope.ALL;
  recurrenceOptionFilter: RecurrenceOption = RecurrenceOption.ALL;
  reservationTypeFilter: ReservationType = ReservationType.ALL;

  constructor(private api: ApiService, private dialog: MatDialog, private router: Router) { }

  ngOnInit(): void {
    console.log(this.dateScopeFilter);
    console.log(this.recurrenceOptionFilter);
    console.log(this.reservationTypeFilter);

    this.fetchReservations(this.dateScopeFilter, this.recurrenceOptionFilter, this.reservationTypeFilter);
  }

  fetchReservations(dateScope: DateScope,
    recurrenceOption: RecurrenceOption,
    reservationType: ReservationType) {

    this.isLoading = true;

    const params: MyBookingFilter = {
      dateScope: dateScope,
      recurrenceOption: recurrenceOption,
      reservationType: reservationType
    }

    this.api.getReservationByFilters(params).subscribe({
      next: (response) => {
        console.log(response.body);
        // this.filteredReservations = response.body as ReservationResponseList[];

        const body = response.body as any[][];

        body.map(item => {
          console.log(item);
        })

        this.filteredReservations = body.map(innerArray => {
          const reservationResponseList = convertToReservationList(innerArray);

          return {
            reservationResponseList,
            isExpand: false,
            showExpandButton: reservationResponseList.length > 1
          } as ReservationResponseList;
        });

        console.log(this.filteredReservations);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching reservations:', err);
        this.isLoading = false;
      }
    });
  }

  applyFilters(dateScopeFilter: DateScope,
    recurrenceOptionFilter: RecurrenceOption,
    reservationTypeFilter: ReservationType) {

    this.dateScopeFilter = dateScopeFilter;
    this.recurrenceOptionFilter = recurrenceOptionFilter;
    this.reservationTypeFilter = reservationTypeFilter;

    this.fetchReservations(this.dateScopeFilter, this.recurrenceOptionFilter, this.reservationTypeFilter);
  }

  onDelete(reservation: ReservationResponse) {
    this.router.navigate(['/cancel-booking', reservation.reservationId]);
  }

  onEdit(reservation: ReservationResponse) {
    this.router.navigate(['/modify-booking', reservation.reservationId]);
  }

  formatTime(time: string | null): string {
    if (!time) return '';
    const [hourStr, minuteStr] = time.split(':');
    const hour = parseInt(hourStr, 10);
    const suffix = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minuteStr} ${suffix}`;
  }

  formatDate(date: Date | string | null): string {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString();
  }

  formatRecurrenceOption(option: string | null): string {
    if (!option) return '';
    switch (option) {
      case 'ONE_TIME': return 'One Time';
      case 'DAILY': return 'Daily';
      case 'WEEKLY': return 'Weekly';
      default: return option;
    }
  }

  formatReservationType(type: string | null): string {
    if (!type) return '';
    switch (type) {
      case 'INTERNAL': return 'Internal';
      case 'EXTERNAL': return 'External';
      default: return type;
    }
  }

  onClickAllReservation(index:number){
    console.log('Clicked');
    this.filteredReservations[index].isExpand = !this.filteredReservations[index].isExpand;
    console.log(this.filteredReservations[index].isExpand);
  }
}

