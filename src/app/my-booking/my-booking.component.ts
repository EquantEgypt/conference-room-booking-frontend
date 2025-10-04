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
import { UserRole } from '../core/enum/user-role';
import { ManagerViewOption } from '../core/enum/manager-view-option';

@Component({
  selector: 'app-my-booking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './my-booking.component.html',
  styleUrls: ['./my-booking.component.css']
})
export class MyBookingComponent implements OnInit {
  DateScope = DateScope;
  ManagerViewOption = ManagerViewOption;

  isLoading = false;
  isManager = false;

  filteredReservations: ReservationResponseList[] = [];

  dateScopeFilter: DateScope = DateScope.ALL;
  recurrenceOptionFilter: RecurrenceOption = RecurrenceOption.ALL;
  reservationTypeFilter: ReservationType = ReservationType.ALL;
  managerViewFilter: ManagerViewOption = ManagerViewOption.MY_RESERVATIONS;

  private currentUser: any;

  constructor(private api: ApiService, private dialog: MatDialog, private router: Router) {}

  ngOnInit(): void {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
      this.isManager = this.currentUser.role === UserRole.MANAGER;
    }

    this.fetchReservations();
  }

  fetchReservations() {
    this.isLoading = true;
    const username = this.currentUser?.username || null;

    const params: MyBookingFilter = {
  dateScope: this.dateScopeFilter,
  recurrenceOption: this.recurrenceOptionFilter,
  reservationType: this.reservationTypeFilter,
  isManager: this.isManager,
  managerView: this.isManager ? this.managerViewFilter.toString() : undefined

};


    this.api.getReservationByFilters(params).subscribe({
      next: (response) => {
        const body = response.body as any[][];

        this.filteredReservations = body
          .map(innerArray => {
            const reservationResponseList = convertToReservationList(innerArray, username);

            const filteredList =
              this.isManager && this.managerViewFilter === ManagerViewOption.MY_RESERVATIONS
                ? reservationResponseList.filter(r => r.isOwner)
                : reservationResponseList;

            return {
              reservationResponseList: filteredList,
              isExpand: false,
              showExpandButton: filteredList.length > 1
            } as ReservationResponseList;
          })
          .filter(group => group.reservationResponseList.length > 0);

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching reservations:', err);
        this.isLoading = false;
      }
    });
  }

  applyFilters(
    dateScopeFilter: DateScope,
    recurrenceOptionFilter: RecurrenceOption,
    reservationTypeFilter: ReservationType,
    managerViewFilter: ManagerViewOption
  ) {
    this.dateScopeFilter = dateScopeFilter;
    this.recurrenceOptionFilter = recurrenceOptionFilter;
    this.reservationTypeFilter = reservationTypeFilter;
    this.managerViewFilter = managerViewFilter;

    this.fetchReservations();
  }

  onDelete(reservation: ReservationResponse) {
    if (this.isManager || reservation.isOwner) {
      this.router.navigate(['/cancel-booking', reservation.reservationId]);
    } else {
      alert("You can only cancel your own reservations.");
    }
  }

  onEdit(reservation: ReservationResponse) {
    if (reservation.isOwner || this.isManager) {
      this.router.navigate(['/modify-booking', reservation.reservationId]);
    } else {
      alert("You can only edit your own reservations.");
    }
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

  onClickAllReservation(index: number) {
    this.filteredReservations[index].isExpand = !this.filteredReservations[index].isExpand;
  }
}
