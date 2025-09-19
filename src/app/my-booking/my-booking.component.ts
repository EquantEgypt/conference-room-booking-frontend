// import { Component, OnInit } from '@angular/core';
// import { ApiService } from '../core/services/api/api.service';
// import { convertToReservationList, ReservationResponse } from '../core/models/reservation-response';
// import { Router } from '@angular/router'; 
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-my-booking',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './my-booking.component.html',
//   styleUrl: './my-booking.component.css'
// })

// export class MyBookingComponent implements OnInit {

//   reservations: ReservationResponse[] = [];
//   isLoading = false;

//   constructor(private api: ApiService) { }

//   ngOnInit(): void {
//     this.fetchReservations();
//   }




//   fetchReservations() {
//     this.isLoading = true;
//     this.api.getAllReservations().subscribe({
//       next: (response) => {
//         console.log('Raw response:', response.body);
//         this.reservations = convertToReservationList(response.body);
//         console.log('Converted reservations:', this.reservations);
//         this.isLoading = false;
//       },
//       error: (err) => {
//         console.error('Error fetching reservations:', err);
//         this.isLoading = false;
//       }
//     });
//   }


//    onDelete(reservation: ReservationResponse) {

//     this.router.navigate(['/cancel-booking', reservation.reservationId]);
//   }


//   formatTime(time: string | null): string {
//     if (!time) return '';
//     // Expecting time in 'HH:mm:ss' or 'HH:mm' format
//     const [hourStr, minuteStr] = time.split(':');
//     const hour = parseInt(hourStr, 10);
//     const suffix = hour >= 12 ? 'PM' : 'AM';
//     const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
//     return `${displayHour}:${minuteStr} ${suffix}`;
//   }

//   formatDate(date: Date | string | null): string {
//     if (!date) return '';
//     const dateObj = typeof date === 'string' ? new Date(date) : date;
//     return dateObj.toLocaleDateString();
//   }

//   formatRecurrenceOption(option: string | null): string {
//     if (!option) return '';
//     switch (option) {
//       case 'ONE_TIME': return 'One Time';
//       case 'DAILY': return 'Daily';
//       case 'WEEKLY': return 'Weekly';
//       default: return option;
//     }
//   }

//   formatReservationType(type: string | null): string {
//     if (!type) return '';
//     switch (type) {
//       case 'INTERNAL': return 'Internal';
//       case 'EXTERNAL': return 'External';
//       default: return type;
//     }
//   }
  
// }

import { Component, OnInit } from '@angular/core';
import { ApiService } from '../core/services/api/api.service';
import { convertToReservationList, ReservationResponse } from '../core/models/reservation-response';
import { MatDialog } from '@angular/material/dialog';
import { CancelBookingComponent } from '../summary/cancel-booking/cancel-booking.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-my-booking',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-booking.component.html',
  styleUrls: ['./my-booking.component.css']
})
export class MyBookingComponent implements OnInit {
  reservations: ReservationResponse[] = [];
  isLoading = false;

  constructor(private api: ApiService, private dialog: MatDialog, private router: Router) {} 

  ngOnInit(): void {
    this.fetchReservations();
  }

  fetchReservations() {
    this.isLoading = true;
    this.api.getAllReservations().subscribe({
      next: (response) => {
        this.reservations = convertToReservationList(response.body);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching reservations:', err);
        this.isLoading = false;
      }
    });
  }

  onDelete(reservation: ReservationResponse) {
    
    const dialogRef = this.dialog.open(CancelBookingComponent, {
      width: '500px',
      data: reservation
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'proceed') {
        this.fetchReservations(); 
      }
    });
     this.router.navigate(['/cancel-booking', reservation.reservationId]);
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
}

